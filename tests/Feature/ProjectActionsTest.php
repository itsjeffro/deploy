<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Action;
use Deploy\Models\Project;
use Deploy\Models\User;
use Deploy\Tests\TestCase;

class ProjectActionsTest extends TestCase
{
    /**
     * @group actions
     */
    public function test_user_can_view_actions()
    {
        $project = Project::factory()->create();

        $response = $this->actingAs($project->user)
            ->json('GET', route('project-actions.index', [
                'project' => $project->id,
            ]));

        $response
            ->assertStatus(200)
            ->assertJson([
                [
                    'name' => 'Clone New Release',
                    'before_hooks' => [],
                    'after_hooks' => [],
                ],
                [
                    'name' => 'Activate New Release',
                    'before_hooks' => [],
                    'after_hooks' => [],
                ],
                [
                    'name' => 'Clean Up',
                    'before_hooks' => [],
                    'after_hooks' => [],
                ],
            ]);
    }

    /**
     * @group actions
     */
    public function test_user_cannot_view_another_users_actions()
    {
        $anotherProject = Project::factory()->create();
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->json('GET', route('project-actions.index', [
                'project' => $anotherProject->id,
            ]));

        $response->assertStatus(403);
    }

    /**
     * @group actions
     */
    public function test_user_can_view_action()
    {
        $action = Action::firstOrFail();
        $project = Project::factory()->create();

        $response = $this->actingAs($project->user)
            ->json('GET', route('project-actions.show', [
                'project' => $project->id,
                'action' => $action->id,
            ]));

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => $action->name,
                'before_hooks' => [],
                'after_hooks' => [],
            ]);
    }

    /**
     * @group actions
     */
    public function test_user_cannot_view_another_users_action()
    {
        $action = Action::firstOrFail();
        $anotherProject = Project::factory()->create();
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->json('GET', route('project-actions.show', [
                'project' => $anotherProject->id,
                'action' => $action->id,
            ]));

        $response->assertStatus(403);
    }

    /**
     * @group actions
     */
    public function test_user_can_reorder_action_hooks()
    {
        $action = Action::firstOrFail();
        $project = Project::factory()->create();

        $response = $this->actingAs($project->user)
            ->json('PUT', route('project-actions.update-hook-order', [
                'project' => $project->id,
                'action' => $action->id,
            ]), [
                'hooks' => [
                    //
                ],
            ]);

        $response->assertStatus(204);
    }

    /**
     * @group actions
     */
    public function test_user_cannot_reorder_another_users_action_hooks()
    {
        $action = Action::firstOrFail();
        $project = Project::factory()->create();
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->json('PUT', route('project-actions.update-hook-order', [
                'project' => $project->id,
                'action' => $action->id,
            ]), [
                'hooks' => [],
            ]);

        $response->assertStatus(403);
    }
}
