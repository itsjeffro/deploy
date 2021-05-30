<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class EnvironmentUnlockTest extends TestCase
{
    /**
     * @group environment
     */
    public function test_validation_error_is_returned_using_invalid_key()
    {
        $project = Project::factory()->create();
        $user = $project->user;
        $route = route('project-environment-unlock.store', $project);

        $setupEnvironmentResponse = $this->actingAs($user)
            ->json('POST', $route, [
                'key' => 'initial_key',
            ]);

        $setupEnvironmentResponse->assertStatus(200);

        $invalidKeyResponse = $this->actingAs($user)
            ->json('POST', $route, [
                'key' => 'invalid_key',
            ]);

        $invalidKeyResponse->assertStatus(422);
        $invalidKeyResponse->assertJson([
            'key' => [
                'Invalid environment key.',
            ],
        ]);
    }

    /**
     * @group environment
     */
    public function test_successfully_unlock_existing_environment()
    {
        $project = Project::factory()->create();
        $user = $project->user;
        $route = route('project-environment-unlock.store', $project);

        $setuplEnvironmentResponse = $this
            ->actingAs($user)
            ->json('POST', $route, [
                'key' => 'initial_key',
            ]);

        $setuplEnvironmentResponse->assertStatus(200);

        $validKeyResponse = $this->actingAs($user)
            ->json('POST', $route, [
                'key' => 'initial_key',
            ]);

        $validKeyResponse->assertStatus(200);
        $validKeyResponse->assertJson(['contents' => '']);
    }
}
