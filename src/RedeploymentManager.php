<?php

namespace Deploy;

use Deploy\Deployment\Processes;
use Deploy\Models\Action;
use Deploy\Models\Deployment;

class RedeploymentManager
{
    /**
     * @var \Deploy\Models\Deployment
     */
    private $deployment;

    /**
     * Instantiate Redploy.
     *
     * @param \Deploy\Models\Deployment $deployment
     */
    public function __construct(Deployment $deployment)
    {
        $this->deployment = $deployment;
    }

    /**
     * Create redeployment record from a previous deployment.
     *
     * @return \Deploy\Models\Deployment
     */
    public function create()
    {
        $deployment = new Deployment();
        $deployment->fill([
            'project_id'      => $this->deployment->project->id,
            'started_at'      => (new \DateTime())->format('Y-m-d H:i:s'),
            'commiter'        => $this->deployment->commiter,
            'commiter_avatar' => $this->deployment->commiter_avatar,
            'repository'      => $this->deployment->repository,
            'reference'       => $this->deployment->reference,
            'branch'          => $this->deployment->branch,
            'commit'          => $this->deployment->commit,
            'commit_url'      => $this->deployment->commit_url,
        ]);
        $deployment->save();

        $action = new Action();
        $actionHooks = $action->getHooksByProject($deployment->project)->get();

        $processes = new Processes($deployment, $deployment->project, $actionHooks);
        $processes->create();

        return $deployment;
    }
}
