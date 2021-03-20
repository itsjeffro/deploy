<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Models\User;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Bus;

class ServerTest extends TestCase
{
    /**
     * @group server
     */
    public function test_successfully_create_server()
    {
        Bus::fake();

        $user = factory(User::class)->create();

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
}
