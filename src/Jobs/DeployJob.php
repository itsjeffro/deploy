<?php

namespace Deploy\Jobs;

use Deploy\Processors\DeploymentProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class DeployJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;
    
    /**
     * @var \Deploy\Processors\DeploymentProcessor
     */
    protected $deploymentProcessor;

    /**
     * Instantiate constructor.
     * 
     * @return void
     */
    public function __construct($deployment, $project)
    {
        $this->deploymentProcessor = new DeploymentProcessor($deployment, $project);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->deploymentProcessor->fire();
    }
}
