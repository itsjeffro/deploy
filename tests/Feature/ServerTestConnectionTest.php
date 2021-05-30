<?php

namespace Deploy\Tests\Feature;

use Deploy\Jobs\TestConnectionJob;
use Deploy\Models\Server;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Queue;

class ServerTestConnectionTest extends TestCase
{
    /**
     * @group server
     */
    public function test_user_can_test_server_connection()
    {
        Queue::fake();

        $server = Server::factory()->create();

        $response = $this->actingAs($server->user)
            ->json('GET', route('server-test-connection.show', [
                'server' => $server->id,
            ]));

        $response->assertStatus(204);

        Queue::assertPushed(function (TestConnectionJob $job) use ($server) {
            return $job->getServer()->id === $server->id;
        });
    }
}
