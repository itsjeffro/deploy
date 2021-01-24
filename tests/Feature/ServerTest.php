<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Models\User;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Bus;

class ServerTest extends TestCase
{
    public function test_successfully_create_server()
    {
        Bus::fake();

        $project = factory(Project::class)->create();
        $user = $project->user;

        $route = route('servers.create', $project);

        $response = $this->actingAs($user)
            ->json('POST', $route, [
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
                'project_path' => '/var/www/html',
            ]);

        $response->assertStatus(201);
        $response->assertJsonFragment([
            'name' => 'Project server',
            'ip_address' => '127.0.0.1',
            'port' => '22',
            'connect_as' => 'user',
            'project_path' => '/var/www/html',
        ]);

        $json = $response->json();

        $publicKey = explode(' ', $json['public_key']);

        $this->assertSame('ssh-rsa', $publicKey[0]);
    }

    public function test_unauthorized_user_cannot_create_server()
    {
        $project = factory(Project::class)->create();

        $route = route('servers.create', $project);

        $response = $this->json('POST', $route, [
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
                'project_path' => '/var/www/html',
            ]);

        $response->assertStatus(403);
    }
}
