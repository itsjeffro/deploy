<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Action;
use Deploy\Models\Hook;
use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class ProjectActionHookTest extends TestCase
{
    /**
     * @group actions
     */
    public function test_user_can_view_one_hook()
    {
        $hook = $this->createTestHook();

        $response = $this->actingAs($hook->project->user)
            ->json('GET', route('project-action-hooks.show', [
                'project' => $hook->project_id,
                'action' => $hook->action_id,
                'hook' => $hook->id,
            ]));

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => $hook->name,
                'script' => $hook->script,
            ]);
    }

    /**
     * @group actions
     */
    public function test_user_can_create_hook_under_action()
    {
        $action = Action::firstOrFail();
        $project = Project::factory()->create();

        $response = $this->actingAs($project->user)
            ->json('POST', route('project-action-hooks.store', [
                'project' => $project->id,
                'action' => $action->id,
            ]),
            [
                'name' => 'NEW_HOOK_NAME',
                'script' => 'echo "NEW_SCRIPT";',
                'position' => 1,
            ]);

        $response
            ->assertStatus(201)
            ->assertJson([
                'name' => 'NEW_HOOK_NAME',
                'script' => 'echo "NEW_SCRIPT";',
                'project_id' => $project->id,
                'action_id' => $action->id,
                'position' => 1,
            ]);
    }

    /**
     * @group actions
     */
    public function test_user_can_update_hook_under_action()
    {
        $hook = $this->createTestHook();

        $response = $this->actingAs($hook->project->user)
            ->json('PUT', route('project-action-hooks.update', [
                'project' => $hook->project_id,
                'action' => $hook->action_id,
                'hook' => $hook->id,
            ]),
            [
                'name' => 'UPDATED_HOOK_NAME',
                'script' => 'echo "UPDATED_SCRIPT";',
            ]);

        $response
            ->assertStatus(200)
            ->assertJson([
                'name' => 'UPDATED_HOOK_NAME',
                'script' => 'echo "UPDATED_SCRIPT";',
            ]);
    }

    /**
     * @group actions
     */
    public function test_user_can_delete_hook_from_action()
    {
        $hook = $this->createTestHook();

        $response = $this->actingAs($hook->project->user)
            ->json('DELETE', route('project-action-hooks.destroy', [
                'project' => $hook->project_id,
                'action' => $hook->action_id,
                'hook' => $hook->id,
            ]));

        $response->assertStatus(204);
    }

    protected function createTestHook(): Hook
    {
        $action = Action::firstOrFail();

        return Hook::factory()->create([
            'action_id' => $action->id,
        ]);
    }
}
