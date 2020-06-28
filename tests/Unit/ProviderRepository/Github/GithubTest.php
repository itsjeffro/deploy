<?php

namespace Deploy\Tests\Unit\ProviderRepository\Github;

use Deploy\ProviderRepository\Github\Github;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\TestCase;

class GithubTest extends TestCase
{
    public function test_formatted_branches_endpoint()
    {
        $body = [
            ['name' => 'master'],
        ];

        $expected = [
            ['name' => 'master'],
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $github = new Github($client,'');

        $this->assertSame($expected, $github->branches('itsjeffro'));
    }

    public function test_formatted_branch_endpoint()
    {
        $body = [
            'commit' => [
                'commit' => [
                    'author' => [
                        'name' => 'itsjeffro',
                    ]
                ],
                'author' => [
                    'avatar_url' => 'https://path/to/avatar',
                ],
                'sha' => '21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
                'html_url' => 'https://github.com/itsjeffro/demo/commit/21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
            ]
        ];

        $expected = [
            'display_name' => 'itsjeffro',
            'avatar_link' => 'https://path/to/avatar',
            'hash' => '21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
            'commit_url' => 'https://github.com/itsjeffro/demo/commit/21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $github = new Github($client,'');

        $this->assertSame($expected, $github->branch('owner/repository', 'master'));
    }

    public function test_formatted_commits_endpoint()
    {
        $body = [];
        $expected = [];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $github = new Github($client,'');

        $this->assertSame($expected, $github->commits('owner/repository'));
    }

    public function test_formatted_commit_endpoint()
    {
        $body = [
            'commit' => [
                'author' => [
                    'name' => 'itsjeffro',
                ]
            ],
            'author' => [
                'avatar_url' => 'https://path/to/avatar',
            ],
            'sha' => '21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
            'html_url' => 'https://github.com/itsjeffro/demo/commit/21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
        ];

        $expected = [
            'display_name' => 'itsjeffro',
            'avatar_link' => 'https://path/to/avatar',
            'hash' => '21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
            'commit_url' => 'https://github.com/itsjeffro/demo/commit/21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4',
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $github = new Github($client,'');

        $this->assertSame($expected, $github->commit('owner/repository', '21cb269e5ca4db6ac2a59edaa99526d9f2cb97f4'));
    }

    public function test_formatted_repository_endpoint()
    {
        $body = [
            'name' => 'demo'
        ];

        $expected = [
            'name' => 'demo'
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $github = new Github($client,'');

        $this->assertSame($expected, $github->repository('owner/repository'));
    }

    public function test_formatted_tags_endpoint()
    {
        $body = [
            [
                'name' => 'v1.0',
                'commit' => [
                    'sha' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                ]
            ]
        ];

        $expected = [
            [
                'name' => 'v1.0',
                'commit' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
            ]
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $github = new Github($client,'');

        $this->assertSame($expected, $github->tags('itsjeffro'));
    }
}
