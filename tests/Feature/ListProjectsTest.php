<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class ListProjectsTest extends TestCase
{
    public function test_successfully_returns_user_projects()
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
}
