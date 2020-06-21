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
use Illuminate\Support\Facades\Log;

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

        event(new EnvironmentSyncing($this->environment));

        $decryptedContents = $this->environmentEncrypter
            ->setKey($this->key)
            ->decrypt($this->environment->contents);

        // Loop through each server to spin up a processor to run our script.
        foreach ($this->project->servers as $server) {
            $client = new Client(
                $this->getHost($server),
                $this->script($server, $decryptedContents)
            );
            
            $processors[] = $client->getProcess();
        }

        // Run through each processor and run the script, as well as collecting  the output.
        foreach ($processors as $processor) {
            $processor->run(function ($type, $output) {
                Log::debug($output);
            });
        }

        // Get the exit codes for each processor after completion.
        foreach ($processors as $processor) {
            Log::debug('Exit code: ' . $processor->getExitCode());
        }

        event(new EnvironmentSynced($this->environment));
    }

    /**
     * Return script to create .env with it's contents.
     *
     * @param  \Deploy\Models\Server $server
     * @param  string $contents
     * @return string
     */
    public function script(Server $server, $contents)
    {
        return 'cd ' . $server->project_path . ' && echo "' . $contents . '" > .env';
    }
}
