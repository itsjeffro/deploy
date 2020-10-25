<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Models\User;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Bus;

class CreateServerTest extends TestCase
{
    public function test_successfully_create_server()
    {
        Bus::fake();

        $project = factory(Project::class)->create();
        $user = $project->user;

        $route = route('project-servers.store', $project);

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

    public function test_user_cannot_create_server_that_doesnt_belong_to_them()
    {
        $project = factory(Project::class)->create();
        $user = factory(User::class)->create();

        $route = route('project-servers.store', $project);

        $response = $this->actingAs($user)
            ->json('POST', $route, [
                'name' => 'Project server',
                'ip_address' => '127.0.0.1',
                'port' => '22',
                'connect_as' => 'user',
                'project_path' => '/var/www/html',
            ]);

        $response->assertStatus(403);
    }
}
