<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Events\EnvironmentSynced;
use Deploy\Events\EnvironmentSyncing;
use Deploy\Models\Environment;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Ssh\Client;
use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Events\ProcessorErrorEvent;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Exception\ProcessTimedOutException;

class WriteEnvironmentProcessor extends AbstractProcessor implements ProcessorInterface
{
    /**
     * @var Project
     */
    private $project;

    /**
     * @var Environment
     */
    private $environment;

    /**
     * @var EnvironmentEncrypter
     */
    private $environmentEncrypter;

    /**
     * @var string
     */
    private $key;

    /**
     * Instantiate EnvironmentProcessor.
     */
    public function __construct(EnvironmentEncrypter $environmentEncrypter)
    {
        $this->environmentEncrypter = $environmentEncrypter;
    }

    /**
     * Set project.
     */
    public function setProject(Project $project): self
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Set environment
     */
    public function setEnvironment(Environment $environment): self
    {
        $this->environment = $environment;

        return $this;
    }

    /**
     * Set decryption key.
     */
    public function setKey(string $key): self
    {
        $this->key = $key;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function fire(): void
    {
        $processors = [];

        $decryptedContents = $this->environmentEncrypter
            ->setKey($this->key)
            ->decrypt($this->environment->contents);

        // Loop through each server to spin up a processor to run our script.
        $serverIds = $this->project
            ->environmentServers()
            ->pluck('server_id');

        $projectServers = ProjectServer::where('project_id', $this->project->id)
            ->whereIn('server_id', $serverIds)
            ->get();

        foreach ($projectServers as $projectServer) {
            $server = $projectServer->server;

            $client = new Client(
                $this->getHost($server),
                $this->script($projectServer->project_path, $decryptedContents)
            );
            
            $processors[] = [
                'process' => $client
                    ->setTimeout(30)
                    ->getProcess(),
                'server' => $server,
            ];
        }

        // Run through each processor (server connection) and run the script.
        foreach ($processors as $processor) {
            $status = Environment::SYNCING;
            $process = $processor['process'];
            $server = $processor['server'];

            try {
                event(new EnvironmentSyncing($server, $status));

                $process->run();

                if (!$process->isSuccessful()) {
                    throw new ProcessFailedException($process);
                }

                $status = Environment::SYNCED;
            } catch (ProcessFailedException | ProcessTimedOutException $exception) {
                $message = $exception->getProcess()->getErrorOutput();

                if ($exception instanceof ProcessTimedOutException) {
                    $message = 'Process timed out trying trying to connect to server. Make sure the server details are correct.';
                }

                event(new ProcessorErrorEvent(
                    'Environment server issue',
                    $this->project->user_id,
                    $server,
                    $message
                ));
                
                $status = Environment::FAILED_SYNC;
            }

            event(new EnvironmentSynced($server, $status));
        }
    }

    /**
     * Return script to create .env with it's contents.
     */
    public function script(string $serverProjectPath, string $contents): string
    {
        return 'cd ' . $serverProjectPath . ' && echo "' . $contents . '" > .env';
    }
}
