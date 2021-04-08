<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Environment;
use Deploy\Models\Project;
use Deploy\Models\Server;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Bus;

class EnvironmentUpdateTest extends TestCase
{
    /**
     * @group environment
     */
    public function test_successfully_update_project_environment()
    {
        Bus::fake();

        $environment = factory(Environment::class)->create();

        $user = $environment->project->user;

        $server = factory(Server::class)->create([
            'user_id' => $user->id,
        ]);

        $environment->environmentServers()->sync($server);

        $response = $this->actingAs($user)
            ->json('PUT', route('project-environment.update', $environment->project), [
                'key' => '123',
                'contents' => 'FOO=BAR',
                'servers' => [
                    $server->id,
                ],
            ]);

        $response->assertStatus(204);
    }
}
