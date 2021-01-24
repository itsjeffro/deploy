<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class FolderTest extends TestCase
{
    public function test_successfully_create_folder()
    {
        $project = factory(Project::class)->create();
        $user = $project->user;

        $route = route('project-folders.store', $project);

        $response = $this->actingAs($user)
            ->json('POST', $route, [
                'from' => 'uploads',
                'to' => 'storage/uploads',
            ]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'project_id' => $project->id,
            'from' => 'uploads',
            'to' => 'storage/uploads',
        ]);
    }
}