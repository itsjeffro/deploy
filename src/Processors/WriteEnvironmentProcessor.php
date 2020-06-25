<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Events\EnvironmentSynced;
use Deploy\Events\EnvironmentSyncing;
use Deploy\Models\Environment;
use Deploy\Models\Project;
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
        foreach ($this->project->servers as $server) {
            $client = new Client(
                $this->getHost($server),
                $this->script($server, $decryptedContents)
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
            } catch (ProcessFailedException | Exception $e) {
                event(new ProcessorErrorEvent('Environment server issue', $this->project->id, $server, $e));
                
                $status = Environment::FAILED_SYNC;
            }

            event(new EnvironmentSynced($server, $status));
        }
    }

    /**
     * Return script to create .env with it's contents.
     *
     * @param Server $server
     * @param string $contents
     * @return string
     */
    public function script(Server $server, string $contents)
    {
        return 'cd ' . $server->project_path . ' && echo "' . $contents . '" > .env';
    }
}
