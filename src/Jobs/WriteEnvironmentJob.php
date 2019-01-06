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

class WriteEnvironmemtJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * @var \Deploy\Processors\WriteEnvironmentProcessor
     */
    protected $writeEnvironmentProcessor;

    /**
     * Create a new job instance.
     *
     * @param  \Deploy\Models\Project $project
     * @param  \Deploy\Models\Environment $environment
     * @param  string $key
     * @return void
     */
    public function __construct(Project $project, Environment $environment, $key)
    {
        $this->writeEnvironmentProcessor = new WriteEnvironmentProcessor($project, $environment, $key);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->writeEnvironmentProcessor->fire();
    }
}
