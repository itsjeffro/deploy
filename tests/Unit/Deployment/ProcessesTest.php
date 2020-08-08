<?php

namespace Deploy\Tests\Unit\Deployment;

use Deploy\Deployment\HookActions;
use Deploy\Deployment\Processes;
use Deploy\Models\Action;
use Deploy\Models\Deployment;
use Deploy\Models\Project;
use Deploy\Models\Server;
use Mockery;
use PHPUnit\Framework\TestCase;

class ProcessesTest extends TestCase
{
    public function test_correct_list_of_processes_returned()
    {
        $deployment = Mockery::mock(Deployment::class);
        $deployment->shouldReceive('getAttribute')->with('id')->andReturn(1);

        $server = Mockery::mock(Server::class);
        $server->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $server->shouldReceive('getAttribute')->with('name')->andReturn('My server');

        $project = Mockery::mock(Project::class);
        $project->shouldReceive('getAttribute')->with('id')->andReturn(1);
        $project->shouldReceive('getAttribute')->with('servers')->andReturn([$server]);

        // Actions
        $actionCloneRelease = Mockery::mock(Action::class);
        $actionCloneRelease->shouldReceive('getAttribute')->with('id')->andReturn(HookActions::ACTION_CLONE_RELEASE_ID);
        $actionCloneRelease->shouldReceive('getAttribute')->with('name')->andReturn(HookActions::ACTION_CLONE_RELEASE_NAME);
        $actionCloneRelease->shouldReceive('getAttribute')->with('beforeHooks')->andReturn([]);
        $actionCloneRelease->shouldReceive('getAttribute')->with('afterHooks')->andReturn([]);

        $activateNewRelease = Mockery::mock(Action::class);
        $activateNewRelease->shouldReceive('getAttribute')->with('id')->andReturn(HookActions::ACTION_ACTIVATE_RELEASE_ID);
        $activateNewRelease->shouldReceive('getAttribute')->with('name')->andReturn(HookActions::ACTION_ACTIVATE_RELEASE_NAME);
        $activateNewRelease->shouldReceive('getAttribute')->with('beforeHooks')->andReturn([]);
        $activateNewRelease->shouldReceive('getAttribute')->with('afterHooks')->andReturn([]);

        $cleanUp = Mockery::mock(Action::class);
        $cleanUp->shouldReceive('getAttribute')->with('id')->andReturn(HookActions::ACTION_CLEAN_UP_ID);
        $cleanUp->shouldReceive('getAttribute')->with('name')->andReturn(HookActions::ACTION_CLEAN_UP_NAME);
        $cleanUp->shouldReceive('getAttribute')->with('beforeHooks')->andReturn([]);
        $cleanUp->shouldReceive('getAttribute')->with('afterHooks')->andReturn([]);

        $actions = [
            $actionCloneRelease,
            $activateNewRelease,
            $cleanUp,
        ];

        $processes = new Processes($deployment, $project, $actions);

        $expected = [
            [
                'deployment_id' => 1,
                'project_id' => 1,
                'server_id' => 1,
                'server_name' => 'My server',
                'sequence' => 1,
                'name' => HookActions::ACTION_CLONE_RELEASE_NAME,
                'action_id' => HookActions::ACTION_CLONE_RELEASE_ID,
                'hook_id' => null,
            ],
            [
                'deployment_id' => 1,
                'project_id' => 1,
                'server_id' => 1,
                'server_name' => 'My server',
                'sequence' => 2,
                'name' => HookActions::ACTION_ACTIVATE_RELEASE_NAME,
                'action_id' => HookActions::ACTION_ACTIVATE_RELEASE_ID,
                'hook_id' => null,
            ],
            [
                'deployment_id' => 1,
                'project_id' => 1,
                'server_id' => 1,
                'server_name' => 'My server',
                'sequence' => 3,
                'name' => HookActions::ACTION_CLEAN_UP_NAME,
                'action_id' => HookActions::ACTION_CLEAN_UP_ID,
                'hook_id' => null,
            ],
        ];

        $this->assertSame($expected, $processes->prepareProcesses());
    }
}
