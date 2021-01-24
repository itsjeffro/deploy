<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Folder;
use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class FolderTest extends TestCase
{
    public function test_successfully_list_folders()
    {
        $project = factory(Project::class)->create();
        $user = $project->user;
        $project->folders()->createMany(
            factory(Folder::class, 1)->make()->toArray()
        );

        $route = route('project-folders.index', $project);

        $response = $this->actingAs($user)
            ->json('GET', $route);

        $response->assertStatus(200);
    }

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

    public function test_successfully_delete_folder()
    {
        $project = factory(Project::class)->create();
        $folder = factory(Folder::class)->create([
            'project_id' => $project->id,
        ]);
        $user = $project->user;

        $route = route('project-folders.destroy', [
            'project' => $project->id,
            'folder' => $folder->id
        ]);

        $response = $this->actingAs($user)
            ->json('DELETE', $route);

        $response->assertStatus(204);
    }
}