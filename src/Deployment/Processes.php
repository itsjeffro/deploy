<?php

namespace Deploy\Deployment;

use Deploy\Models\Project;
use Deploy\Models\Deployment;
use Deploy\Models\Process;

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
     * @param  \Deploy\Models\Deployment $deployment
     * @param  \Deploy\Models\Project $project
     * @param  array $actions
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
        Process::insert($this->prepareProcesses());
    }

    /**
     * Loops through each sequence (action) along with each server associated with the project.
     * 
     * @return array
     */
    public function prepareProcesses(): array
    {
        $sequences = $this->getSequences($this->actions);
        $processes = [];
        $sequenceNumber = 1;

        foreach ($sequences as $sequence) {
            foreach ($this->project->servers as $server) {
                $processes[] = array_merge($sequence, [
                    'deployment_id' => $this->deployment->id,
                    'project_id' => $this->project->id,
                    'server_id' => $server->id,
                    'server_name' => $server->name,
                    'sequence' => $sequenceNumber,
                ]);
            }

            $sequenceNumber++;
        }

        return $processes;
    }

    /**
     * Get list of processes.
     *
     * @param $actions
     * @return array
     */
    public function getSequences($actions): array
    {
        $sequences = [];

        $defaults = [
            'deployment_id' => null,
            'project_id' => null,
            'server_id' =>  null,
            'server_name' =>  null,
            'sequence' => null,
            'name' => null,
            'action_id' => null,
            'hook_id' =>  null,
        ];

        foreach ($actions as $action) {
            foreach ($action->beforeHooks as $beforeHook) {
                $sequences[] = array_merge($defaults, [
                    'name' => $beforeHook->name,
                    'hook_id' =>  $beforeHook->id,
                ]);
            }

            $sequences[] = array_merge($defaults, [
                'name' => $action->name,
                'action_id' => $action->id,
            ]);

            foreach ($action->afterHooks as $afterHook) {
                $sequences[] = array_merge($defaults, [
                    'name' => $afterHook->name,
                    'hook_id' =>  $afterHook->id,
                ]);
            }
        }

        return $sequences;
    }
}
