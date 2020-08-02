<?php

namespace Deploy\Tests\Unit\Deployment;

use Deploy\Deployment\HookActions;
use Deploy\Deployment\Processes;
use Deploy\Models\Action;
use Deploy\Models\Deployment;
use Deploy\Models\Project;
use Mockery;
use PHPUnit\Framework\TestCase;
use stdClass;

class ProcessesTest extends TestCase
{
    public function test_correct_list_of_processes_returned()
    {
        $deployment = Mockery::mock(Deployment::class)->makePartial();
        $deployment->id = 1;

        $server = Mockery::mock(stdClass::class);
        $server->id = 1;
        $server->name = 'My server';

        $project = Mockery::mock(Project::class)->makePartial();
        $project->id = 1;
        $project->servers = [
            $server
        ];

        $actionCloneRelease = Mockery::mock(Action::class)->makePartial();
        $actionCloneRelease->id = HookActions::ACTION_CLONE_RELEASE_ID;
        $actionCloneRelease->name = HookActions::ACTION_CLONE_RELEASE_NAME;
        $actionCloneRelease->beforeHooks = [];
        $actionCloneRelease->afterHooks = [];

        $activateNewRelease = Mockery::mock(Action::class)->makePartial();
        $activateNewRelease->id = HookActions::ACTION_ACTIVATE_RELEASE_ID;
        $activateNewRelease->name = HookActions::ACTION_ACTIVATE_RELEASE_NAME;
        $activateNewRelease->beforeHooks = [];
        $activateNewRelease->afterHooks = [];

        $cleanUp = Mockery::mock(Action::class)->makePartial();
        $cleanUp->id = HookActions::ACTION_CLEAN_UP_ID;
        $cleanUp->name = HookActions::ACTION_CLEAN_UP_NAME;
        $cleanUp->beforeHooks = [];
        $cleanUp->afterHooks = [];

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
