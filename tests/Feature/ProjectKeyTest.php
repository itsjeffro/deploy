<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class ProjectKeyTest extends TestCase
{
    public function test_owner_can_update_their_projects_key()
    {
        $project = Project::factory()->create();
        $user = $project->user;

        $response = $this->actingAs($user)
            ->json('PUT', route('project-key.update', ['project' => $project->id]));

        $response->assertStatus(200);

        $data = $response->decodeResponseJson();

        $this->assertArrayHasKey('key', $data);
        $this->assertTrue($data['key'] !== $project->key);
        $this->assertSame(40, strlen($data['key']));
    }
}
