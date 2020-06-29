<?php

namespace Deploy\Tests\Unit\Deployment;

use Deploy\Deployment\HookActions;
use PHPUnit\Framework\TestCase;

class HookActionsTest extends TestCase
{
    public function test_server_returned_with_hooks()
    {
        $servers = [
            ['id' => 1],
        ];
    
        $hookActions = new HookActions();

        $actions = $hookActions
            ->setServers($servers)
            ->getActions();

        $expected = [
            [
                'id' => HookActions::ACTION_CLONE_RELEASE_ID,
                'name' => HookActions::ACTION_CLONE_RELEASE_NAME,
                'servers' => [
                    ['id' => 1]
                ],
                'deploy_hook_id' => null,
            ],
            [
                'id' => HookActions::ACTION_ACTIVATE_RELEASE_ID,
                'name' => HookActions::ACTION_ACTIVATE_RELEASE_NAME,
                'servers' => [
                    ['id' => 1]
                ],
                'deploy_hook_id' => null,
            ],
            [
                'id' => HookActions::ACTION_CLEAN_UP_ID,
                'name' => HookActions::ACTION_CLEAN_UP_NAME,
                'servers' => [
                    ['id' => 1]
                ],
                'deploy_hook_id' => null,
            ],
        ];

        $this->assertSame($expected, $actions);
    }
}
