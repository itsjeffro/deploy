<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Deployment;
use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class DeploymentTest extends TestCase
{
    /**
     * @group deployment
     */
    public function test_user_can_view_deployments()
    {
        $project = factory(Project::class)->create();

        $response = $this->actingAs($project->user)
            ->json('GET', route('project-deployments.index', $project));

        $response->assertStatus(200);
    }

    /**
     * @group deployment
     */
    public function test_user_can_view_one_deployment()
    {
        $project = factory(Project::class)->create();

        $deployment = factory(Deployment::class)->create([
            'project_id' => $project->id,
        ]);

        $response = $this->actingAs($project->user)
            ->json('GET', route('project-deployments.show', [
                'project' => $project->id,
                'deployment' => $deployment->id,
            ]));

        $response->assertStatus(200);
    }
}
