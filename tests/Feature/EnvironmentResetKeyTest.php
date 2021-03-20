<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class EnvironmentResetKeyTest extends TestCase
{
    /**
     * @group environment
     */
    public function test_existing_environment_is_cleared_after_key_reset()
    {
        $project = factory(Project::class)->create();

        // Setup initial environment
        $setupResponse = $this
            ->actingAs($project->user)
            ->json(
                'POST',
                route('project-environment-unlock.store', $project),
                [
                    'key' => 'INITIAL_KEY',
                ]
            );

        $setupResponse->assertStatus(200);

        // Reset key and clear environment contents
        $resetResponse = $this
            ->actingAs($project->user)
            ->json(
                'PUT',
                route('project-environment-reset.update', $project),
                [
                    'key' => 'UPDATED_KEY',
                ]
            );

        $resetResponse->assertStatus(204);
    }

    /**
     * @group environment
     */
    public function test_nonexistent_environment_is_created_with_new_key()
    {
        $project = factory(Project::class)->create();

        // If the user is trying to reset a key for an environment that does not
        // exist, then a new environment will be created with the desired key.
        $resetResponse = $this
            ->actingAs($project->user)
            ->json(
                'PUT',
                route('project-environment-reset.update', $project),
                [
                    'key' => 'UPDATED_KEY',
                ]
            );

        $resetResponse->assertStatus(200);
    }
}
