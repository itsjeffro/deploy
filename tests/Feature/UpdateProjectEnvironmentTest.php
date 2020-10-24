<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Environment;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Bus;

class UpdateProjectEnvironmentTest extends TestCase
{
    public function test_successfully_update_project_environment()
    {
        Bus::fake();

        $environment = factory(Environment::class)->create();
        $user = $environment->project->user;

        $route = route('project-environment.update', $environment->project);

        $request = [
            'key' => '123',
            'contents' => 'FOO=BAR',
            'servers' => [],
        ];

        $response = $this->actingAs($user)
            ->json('PUT', $route, $request);

        $response->assertStatus(204);
    }
}
