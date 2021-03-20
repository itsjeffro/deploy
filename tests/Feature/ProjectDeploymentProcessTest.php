<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Deployment;
use Deploy\Models\Process;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Deploy\Tests\TestCase;

class ProjectDeploymentProcessTest extends TestCase
{
    /**
     * @group project
     * @group server
     */
    public function test_user_can_view_one_process_from_deployment()
    {
        $process = $this->createTestProcess();

        $response = $this
            ->actingAs($process->project->user)
            ->json('GET', route('project-deployment-process.show', [
                'project' => $process->project_id,
                'deployment' => $process->deployment_id,
                'process' => $process->id,
            ]));

        $response->assertStatus(200);
    }

    protected function createTestProcess(): Process
    {
        $project = factory(Project::class)->create();

        // Assign a server to project
        $project->servers()->createMany(
            factory(Server::class, 1)->make()->toArray()
        );

        $projectServer = ProjectServer::where('project_id', $project->id)
            ->firstOrFail();

        // Create a deployment
        $deployment = factory(Deployment::class)->create([
            'project_id' => $project->id,
        ]);

        // Create a process against the project's deployment
        return factory(Process::class)->create([
            'name' => 'Clone new release',
            'project_id' => $project->id,
            'deployment_id' => $deployment->id,
            'server_id' => $projectServer->server_id,
        ]);
    }
}
