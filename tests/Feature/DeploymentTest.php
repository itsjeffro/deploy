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
        $project = Project::factory()->create();

        $response = $this->actingAs($project->user)
            ->json('GET', route('project-deployments.index', $project));

        $response->assertStatus(200);
    }

    /**
     * @group deployment
     */
    public function test_user_can_view_one_deployment()
    {
        $project = Project::factory()->create();

        $deployment = Deployment::factory()->create([
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
