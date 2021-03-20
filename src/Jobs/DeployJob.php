<?php

namespace Deploy\Jobs;

use Deploy\Models\Deployment;
use Deploy\Models\Project;
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
    
    /** @var Deployment */
    protected $deployment;

    /** @var Project */
    protected $project;

    /**
     * Instantiate constructor.
     *
     * @param $deployment
     * @param $project
     * @return void
     */
    public function __construct($deployment, $project)
    {
        $this->deployment = $deployment;
        $this->project = $project;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(DeploymentProcessor $processor)
    {
        $processor
            ->setDeployment($this->deployment)
            ->setProject($this->project)
            ->fire();
    }

    public function getDeployment(): Deployment
    {
        return $this->deployment;
    }

    public function getProject(): Project
    {
        return $this->project;
    }
}
