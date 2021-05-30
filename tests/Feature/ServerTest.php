<?php

namespace Deploy\Tests\Feature;

use Deploy\Jobs\DeleteServerKeysJob;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Deploy\Models\User;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Queue;

class ServerTest extends TestCase
{
    /**
     * @group server
     */
    public function test_user_can_view_servers()
    {
        $user = User::factory()->create();
        $user->servers()->createMany(
            Server::factory()->count(1)->make()->toArray()
        );

        $response = $this->actingAs($user)
            ->json('GET', route('servers.index'));

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    [
                        'name' => 'Server name',
                        'port' => 3306,
                        'ip_address' => '127.0.0.1',
                        'connect_as' => 'root',
                        'public_key' => 'ssh-rsa random-key',
                    ]
                ]
            ]);
    }

    /**
     * @group server
     */
    public function test_user_can_view_one_server()
    {
        $user = User::factory()->create();
        $server = Server::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)
            ->json('GET', route('servers.show', [
                'server' => $server->id,
            ]));

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => 'Server name',
                'port' => 3306,
                'ip_address' => '127.0.0.1',
                'connect_as' => 'root',
                'public_key' => 'ssh-rsa random-key',
            ]);
    }

    /**
     * @group server
     */
    public function test_user_can_create_server()
    {
        Bus::fake();

        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->json('POST', route('servers.create'), [
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
            ]);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
            'user_id' => $user->id,
            'name' => 'Project server',
            'ip_address' => '127.0.0.1',
            'port' => '22',
            'connect_as' => 'user',
        ]);

        $json = $response->json();
        $publicKey = explode(' ', $json['public_key']);

        $this->assertSame('ssh-rsa', $publicKey[0]);
    }

    /**
     * @group server
     * @group project
     */
    public function test_user_can_create_server_and_attach_to_project()
    {
        Bus::fake();

        $project = Project::factory()->create();

        $response = $this->actingAs($project->user)
            ->json('POST', route('servers.create'), [
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
                'project_id' => $project->id,
                'project_path' => '/var/www/html',
            ]);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'user_id' => $project->user->id,
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
            ]);

        $json = $response->json();
        $publicKey = explode(' ', $json['public_key']);

        $this->assertSame('ssh-rsa', $publicKey[0]);
    }

    /**
     * @group server
     */
    public function test_unauthorized_user_cannot_create_server()
    {
        $response = $this->json('POST', route('servers.create'), [
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
            ]);

        $response->assertStatus(403);
    }

    /**
     * @group server
     */
    public function test_user_can_update_server()
    {
        $user = User::factory()->create();

        $server = Server::factory()->create([
            'user_id' => $user->id
        ]);

        $response = $this->actingAs($user)
            ->json(
                'PUT',
                route('servers.update', [ 'server' => $server->id]),
                [
                    'name' => 'UPDATED_SERVER_NAME',
                    'ip_address' => '127.0.0.1',
                    'port' => 22,
                    'connect_as' => 'root',
                ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => 'UPDATED_SERVER_NAME',
                'ip_address' => '127.0.0.1',
                'port' => 22,
                'connect_as' => 'root',
            ]);
    }

    /**
     * @group server
     */
    public function test_user_can_delete_server()
    {
        Queue::fake();

        $user = User::factory()->create();
        $server = Server::factory()->create([
            'user_id' => $user->id,
        ]);

        $response = $this->actingAs($user)
            ->json('DELETE', route('servers.destroy', [
                'server' => $server->id,
            ]));

        $response->assertStatus(204);

        Queue::assertPushed(function (DeleteServerKeysJob $job) use ($server) {
            return $job->getServer()->id === $server->id;
        });
    }

    /**
     * @group server
     */
    public function test_user_cannot_delete_server_attached_to_project()
    {
        Queue::fake();

        $project = Project::factory()->create();

        $server = Server::factory()->create([
            'user_id' => $project->user->id
        ]);

        ProjectServer::create([
            'project_id' => $project->id,
            'server_id' => $server->id,
        ]);

        $response = $this->actingAs($project->user)
            ->json('DELETE', route('servers.destroy', [
                'server' => $server->id,
            ]));

        $response->assertStatus(422);
    }
}
