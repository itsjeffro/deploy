<?php

namespace Deploy;

use Deploy\Deployment\Processes;
use Deploy\Models\Action;
use Deploy\Models\Deployment;
use Deploy\Models\Project;
use Deploy\ProviderRepository\Reference;

class DeploymentManager
{
    /**
     * @var \Deploy\Models\Project
     */
    protected $project;

    /**
     * @var \Deploy\ProviderRepository\Reference
     */
    protected $reference;

    /**
     * Instantiate.
     *
     * @param \Deploy\Models\Project               $project
     * @param \Deploy\ProviderRepository\Reference $reference
     */
    public function __construct(Project $project, Reference $reference)
    {
        $this->project = $project;
        $this->reference = $reference;
    }

    /**
     * Create deployment record from project.
     *
     * @param \Deploy\Models\Project $project
     *
     * @return \Deploy\Models\Deployment
     */
    public function create()
    {
        $deployment = new Deployment();
        $deployment->fill([
            'project_id'      => $this->project->id,
            'repository'      => $this->project->repository,
            'reference'       => $this->reference->getReference(),
            'branch'          => $this->reference->getId(),
            'started_at'      => (new \DateTime())->format('Y-m-d H:i:s'),
        ]);
        $deployment->save();

        $action = new Action();
        $actionHooks = $action->getHooksByProject($this->project)->get();

        $processes = new Processes($deployment, $this->project, $actionHooks);
        $processes->create();

        return $deployment;
    }
}
