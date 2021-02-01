<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Events\EnvironmentSynced;
use Deploy\Events\EnvironmentSyncing;
use Deploy\Models\Environment;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Deploy\Ssh\Client;
use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Events\ProcessorErrorEvent;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Exception\ProcessFailedException;

class WriteEnvironmentProcessor extends AbstractProcessor implements ProcessorInterface
{
    /** @var Project */
    private $project;

    /** @var Environment */
    private $environment;

    /** @var EnvironmentEncrypter */
    private $environmentEncrypter;

    /** @var string */
    private $key;

    /**
     * Instantiate EnvironmentProcessor.
     *
     * @param EnvironmentEncrypter  $environmentEncrypter
     * @return void
     */
    public function __construct(EnvironmentEncrypter $environmentEncrypter)
    {
        $this->environmentEncrypter = $environmentEncrypter;
    }

    /**
     * @param Project $project
     * @return self
     */
    public function setProject(Project $project)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @param Environment $environment
     * @return self
     */
    public function setEnvironment(Environment $environment)
    {
        $this->environment = $environment;

        return $this;
    }

    /**
     * @param string $key
     * @return self
     */
    public function setKey(string $key)
    {
        $this->key = $key;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function fire()
    {
        $processors = [];

        $decryptedContents = $this->environmentEncrypter
            ->setKey($this->key)
            ->decrypt($this->environment->contents);

        // Loop through each server to spin up a processor to run our script.
        $serverIds = $this->project
            ->servers
            ->pluck('id');

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
                'process' => $client->getProcess(),
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
            } catch (ProcessFailedException | Exception $exception) {
                event(new ProcessorErrorEvent(
                    'Environment server issue',
                    $this->project->user_id,
                    $server,
                    $exception
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
