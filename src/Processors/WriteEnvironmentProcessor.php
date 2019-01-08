<?php

namespace Deploy\Processors;

use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Events\EnvironmentSynced;
use Deploy\Events\EnvironmentSyncing;
use Deploy\Models\Environment;
use Deploy\Models\Project;
use Deploy\Models\Server;
use Deploy\Ssh\Client;
use Illuminate\Support\Facades\Log;

class WriteEnvironmentProcessor extends AbstractProcessor
{
    /**
     * @var \Deploy\Models\Project
     */
    private $project;

    /**
     * @var \Deploy\Models\Environment
     */
    private $environment;

    /**
     * @var \Deploy\Environment\EnvironmentEncrypter
     */
    private $encrypter;

    /**
     * Instantiate EnvironmentProcessor.
     *
     * @param \Deploy\Models\Project     $project
     * @param \Deploy\Models\Environment $environment
     * @param string                     $key
     *
     * @return void
     */
    public function __construct(Project $project, Environment $environment, $key)
    {
        $this->project = $project;
        $this->environment = $environment;
        $this->encrypter = new EnvironmentEncrypter($key);
    }

    /**
     * {@inheritdoc}
     */
    public function fire()
    {
        $processors = [];

        event(new EnvironmentSyncing($this->environment));

        // Loop through each server to spin up a processor to run our script.
        foreach ($this->project->servers as $server) {
            $client = new Client(
                $this->getHost($server),
                $this->script($server, $this->encrypter->decrypt($this->environment->contents))
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
            Log::debug('Exit code: '.$processor->getExitCode());
        }

        event(new EnvironmentSynced($this->environment));
    }

    /**
     * Return script to create .env with it's contents.
     *
     * @param \Deploy\Models\Server $server
     * @param string                $contents
     *
     * @return string
     */
    public function script(Server $server, $contents)
    {
        return 'cd '.$server->project_path.' && echo "'.$contents.'" > .env';
    }
}
