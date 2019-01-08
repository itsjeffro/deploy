<?php

namespace Deploy\Deployment;

use Deploy\Models\Deployment;
use Deploy\Models\Process;
use Deploy\Models\Project;

class Processes
{
    /**
     * @var array
     */
    public $actions;

    /**
     * @var \Deploy\Models\Deployment
     */
    public $deployment;

    /**
     * @var \Deploy\Models\Project
     */
    public $project;

    /**
     * Instantiate DeploymentProcesses.
     *
     * @param \Deploy\Models\Deployment $deployment
     * @param \Deploy\Models\Project    $project
     * @param array                     $actions
     *
     * @return void
     */
    public function __construct(Deployment $deployment, Project $project, $actions)
    {
        $this->deployment = $deployment;
        $this->project = $project;
        $this->actions = $actions;
    }

    /**
     * Create deployment processes.
     *
     * @return array
     */
    public function create()
    {
        $sequences = $this->getSequences($this->actions);
        $processes = [];
        $sequenceNumber = 1;

        foreach ($sequences as $sequence) {
            foreach ($this->project->servers as $server) {
                $processes[] = array_merge($sequence, [
                    'deployment_id' => $this->deployment->id,
                    'project_id'    => $server->project->id,
                    'server_id'     => $server->id,
                    'server_name'   => $server->name,
                    'sequence'      => $sequenceNumber,
                ]);
            }
            $sequenceNumber++;
        }

        Process::insert($processes);
    }

    /**
     * Get list of processes.
     *
     * @param array $actions
     *
     * @return array
     */
    public function getSequences($actions)
    {
        $sequences = [];

        foreach ($actions as $action) {
            foreach ($action->beforeHooks as $beforeHook) {
                $sequences[] = [
                    'deployment_id' => null,
                    'project_id'    => null,
                    'server_id'     => null,
                    'server_name'   => null,
                    'sequence'      => null,
                    'name'          => $beforeHook->name,
                    'action_id'     => null,
                    'hook_id'       => $beforeHook->id,
                ];
            }

            $sequences[] = [
                'deployment_id' => null,
                'project_id'    => null,
                'server_id'     => null,
                'server_name'   => null,
                'sequence'      => null,
                'name'          => $action->name,
                'action_id'     => $action->id,
                'hook_id'       => null,
            ];

            foreach ($action->afterHooks as $afterHook) {
                $sequences[] = [
                    'deployment_id' => null,
                    'project_id'    => null,
                    'server_id'     => null,
                    'server_name'   => null,
                    'sequence'      => null,
                    'name'          => $afterHook->name,
                    'action_id'     => null,
                    'hook_id'       => $afterHook->id,
                ];
            }
        }

        return $sequences;
    }
}
