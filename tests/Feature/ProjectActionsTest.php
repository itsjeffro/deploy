<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Action;
use Deploy\Models\Project;
use Deploy\Tests\TestCase;

class ProjectActionsTest extends TestCase
{
    /**
     * @group actions
     */
    public function test_user_can_view_project_actions()
    {
        $project = factory(Project::class)->create();

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
    public function test_user_can_view_one_of_project_actions()
    {
        $action = Action::firstOrFail();
        $project = factory(Project::class)->create();

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
}
