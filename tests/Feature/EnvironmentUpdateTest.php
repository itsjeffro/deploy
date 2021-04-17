<?php

namespace Deploy\Tests\Feature;

use Deploy\Jobs\WriteEnvironmentJob;
use Deploy\Models\Environment;
use Deploy\Models\Server;
use Deploy\Tests\TestCase;
use Illuminate\Encryption\Encrypter;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Queue;

class EnvironmentUpdateTest extends TestCase
{
    /**
     * @group environment
     */
    public function test_successfully_update_project_environment()
    {
        $environmentKey = 'my-key';

        $mock = \Mockery::mock(Encrypter::class);
        $mock->shouldReceive('encryptString')->times(1)->andReturn($environmentKey);
        $mock->shouldReceive('decryptString')->times(1)->andReturn($environmentKey);

        Crypt::swap($mock);
        Queue::fake();

        $environment = factory(Environment::class)->create();

        $user = $environment->project->user;

        $server = factory(Server::class)->create([
            'user_id' => $user->id,
        ]);

        $environment->environmentServers()->sync($server);

        $response = $this->actingAs($user)
            ->json('PUT', route('project-environment.update', $environment->project), [
                'key' => $environmentKey,
                'contents' => 'FOO=BAR',
                'servers' => [
                    $server->id,
                ],
            ]);

        $response->assertStatus(204);

        Queue::assertPushed(function (WriteEnvironmentJob $job) use ($environmentKey) {
            return $job->getDecryptedKey() === $environmentKey;
        });
    }
}
