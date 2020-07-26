<?php

namespace Deploy\Tests\Unit;

use Deploy\DeployMessages;
use Illuminate\Contracts\Config\Repository;
use Mockery;
use PHPUnit\Framework\TestCase;

class DeployMessagesTest extends TestCase
{
    /**
     * @dataProvider messages_provider
     */
    public function test_correct_codes_returned($config, $code)
    {
        $deployMessages = new DeployMessages($config);

        $expectedMessages = [
            ['code' => $code]
        ];

        // Just return the codes from the warning messages.
        $warnings = array_map(function($warning) {
            return ['code' => $warning['code']];
        }, $deployMessages->getWarnings());

        $this->assertSame($expectedMessages, $warnings);
    }

    public function messages_provider()
    {
        $config1 = Mockery::mock(Repository::class);
        $config1->shouldReceive('get')->with('broadcasting.default')->andReturn('log');
        $config1->shouldReceive('get')->with('broadcasting.connections.pusher.key')->andReturn('pusher_key_value');
        $config1->shouldReceive('get')->with('queue.default')->andReturn('database');

        $config2 = Mockery::mock(Repository::class);
        $config2->shouldReceive('get')->with('broadcasting.default')->andReturn('pusher');
        $config2->shouldReceive('get')->with('broadcasting.connections.pusher.key')->andReturn(null);
        $config2->shouldReceive('get')->with('queue.default')->andReturn('redis');

        $config3 = Mockery::mock(Repository::class);
        $config3->shouldReceive('get')->with('broadcasting.default')->andReturn('pusher');
        $config3->shouldReceive('get')->with('broadcasting.connections.pusher.key')->andReturn('pusher_key_value');
        $config3->shouldReceive('get')->with('queue.default')->andReturn('sync');

        return [
            'returns BROADCASTER_DRIVER code when pusher is not enabled' => [
                'config' => $config1,
                'code' => DeployMessages::BROADCASTER_DRIVER,
            ],
            'returns BROADCASTER_CREDENTIALS code when pusher credentials are not set' => [
                'config' => $config2,
                'code' => DeployMessages::BROADCASTER_CREDENTIALS,
            ],
            'returns QUEUE_CONNECTION code when connection is sync' => [
                'config' => $config3,
                'code' => DeployMessages::QUEUE_CONNECTION,
            ]
        ];
    }
}
