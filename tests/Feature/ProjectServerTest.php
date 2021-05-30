<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Deploy\Tests\TestCase;

class ProjectServerTest extends TestCase
{
    /**
     * @group project
     * @group server
     */
    public function test_user_can_view_project_servers()
    {
        $project = Project::factory()->create();

        $project->servers()->createMany(
            Server::factory()->count(3)->make()->toArray()
        );

        $response = $this
            ->actingAs($project->user)
            ->json('GET', route('project-servers.index', [
                'project' => $project->id,
            ]));

        $response->assertStatus(200);

        $decodedJson = $response->decodeResponseJson();
        $server = $decodedJson[0]['server'];

        $this->assertCount(3, $decodedJson);

        $this->assertArrayHasKey('id', $server);
        $this->assertArrayHasKey('user_id', $server);
        $this->assertArrayHasKey('name', $server);
        $this->assertArrayHasKey('ip_address', $server);
        $this->assertArrayHasKey('port', $server);
        $this->assertArrayHasKey('connect_as', $server);
        $this->assertArrayHasKey('connection_status', $server);
        $this->assertArrayHasKey('public_key', $server);
    }

    /**
     * @group project
     * @group server
     */
    public function test_user_can_view_one_project_server()
    {
        $project = Project::factory()->create();

        $project->servers()->createMany(
            Server::factory()->count(3)->make()->toArray()
        );

        $projectServer = ProjectServer::where('project_id', $project->id)->firstOrFail();

        $response = $this
            ->actingAs($project->user)
            ->json('GET', route('project-servers.show', [
                'project' => $project->id,
                'server' => $projectServer->server_id,
            ]));

        $response->assertStatus(200);
    }

    /**
     * @group project
     * @group server
     */
    public function test_user_can_update_project_server()
    {
        $project = Project::factory()->create();

        $project->servers()->createMany(
            Server::factory()->count(3)->make()->toArray()
        );

        $projectServer = ProjectServer::where('project_id', $project->id)->firstOrFail();

        $response = $this
            ->actingAs($project->user)
            ->json('PUT', route('project-servers.update', [
                'project' => $project->id,
                'server' => $projectServer->server_id,
            ]),
            [
                'server_id' => $projectServer->server_id,
                'project_path' => '/var/www/html',
            ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'server_id' => $projectServer->server_id,
                'project_path' => '/var/www/html',
            ]);
    }

    /**
     * @group project
     * @group server
     */
    public function test_user_can_delete_project_server()
    {
        $project = Project::factory()->create();

        $project->servers()->createMany(
            Server::factory()->count(3)->make()->toArray()
        );

        $projectServer = ProjectServer::where('project_id', $project->id)->firstOrFail();

        $response = $this
            ->actingAs($project->user)
            ->json('DELETE', route('project-servers.destroy', [
                'project' => $project->id,
                'server' => $projectServer->server_id,
            ]));

        $response->assertStatus(204);
    }
}
