<?php

namespace Deploy\Jobs;

use Deploy\Models\Environment;
use Deploy\Models\Project;
use Deploy\Processors\WriteEnvironmentProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class WriteEnvironmentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /** @var Project */
    private $project;

    /** @var Environment */
    private $environment;

    /** @var WriteEnvironmentProcessor */
    protected $writeEnvironmentProcessor;

    /** @var string */
    protected $key;

    /**
     * Create a new job instance.
     *
     * @param Project $project
     * @param Environment $environment
     * @param string $key
     * @return void
     */
    public function __construct(Project $project, Environment $environment, $key)
    {
        $this->project = $project;
        $this->environment = $environment;
        $this->key = $key;
    }

    /**
     * Execute the job.
     *
     * @param WriteEnvironmentProcessor $processor
     * @return void
     */
    public function handle(WriteEnvironmentProcessor $processor)
    {
        $processor
            ->setProject($this->project)
            ->setEnvironment($this->environment)
            ->setKey($this->key)
            ->fire();
    }
}
