<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class ProjectTest extends TestCase
{
    /**
     * @group project
     */
    public function test_owner_can_view_their_projects()
    {
        $project = factory(Project::class)->create([
            'name' => 'My first project',
        ]);

        $user = $project->user;

        $response = $this->actingAs($user)
            ->json('GET', route('projects.index'));

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'name' => 'My first project',
        ]);
    }

    /**
     * @group project
     */
    public function test_owner_can_view_their_own_project()
    {
        $project = factory(Project::class)->create([
            'name' => 'My first project',
        ]);

        $user = $project->user;

        $response = $this->actingAs($user)
            ->json('GET', route('projects.show', ['project' => $project->id]));

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => 'My first project',
            ]);
    }

    /**
     * @group project
     */
    public function test_owner_can_update_their_project()
    {
        $project = factory(Project::class)->create();
        $user = $project->user;

        $response = $this->actingAs($user)
            ->json('PUT', route('project.update', ['project' => $project->id]), [
                    'name' => 'UPDATED_NAME',
                    'provider_id' => 1,
                    'repository' => 'REPOSITORY_URL',
                    'branch' => 'BRANCH',
                    'releases' => 1,
                ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => 'UPDATED_NAME',
                'provider_id' => 1,
                'repository' => 'REPOSITORY_URL',
                'branch' => 'BRANCH',
                'releases' => 1,
            ]);
    }

    /**
     * @group project
     */
    public function test_owner_can_delete_their_project()
    {
        $project = factory(Project::class)->create();
        $user = $project->user;

        $response = $this->actingAs($user)
            ->json('DELETE', route('projects.destroy', ['project' => $project->id]));

        $response->assertStatus(204);
    }
}
