<?php

namespace Deploy\Tests\Unit\ProviderRepository\Bitbucket;

use Deploy\ProviderRepository\Bitbucket\Bitbucket;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\TestCase;

class BitbucketTest extends TestCase
{
    public function test_formatted_branches_endpoint()
    {
        $body = [
            'values' => [
                ['name' => 'master'],
            ]
        ];

        $expected = [
            ['name' => 'master'],
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $bitbucket = new Bitbucket($client,'');

        $this->assertSame($expected, $bitbucket->branches('itsjeffro'));
    }

    public function test_formatted_branch_endpoint()
    {
        $body = [
            'target' => [
                'author' => [
                    'user' => [
                        'display_name' => 'itsjeffro',
                        'links' => [
                            'avatar' => [
                                'href' => 'https://path/to/avatar'
                            ]
                        ],
                    ]
                ],
                'hash' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                'links' => [
                    'html' => [
                        'href' => 'https://bitbucket.org/itsjeffro/demo/commits/a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                    ]
                ]
            ]
        ];

        $expected = [
            'display_name' => 'itsjeffro',
            'avatar_link' => 'https://path/to/avatar',
            'hash' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
            'commit_url' => 'https://bitbucket.org/itsjeffro/demo/commits/a588cf368828430b115fc3c3a73e9eb85b7a6b32',
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $bitbucket = new Bitbucket($client,'');

        $this->assertSame($expected, $bitbucket->branch('itsjeffro', 'master'));
    }


    public function test_formatted_commits_endpoint()
    {
        $body = [
            'values' => [
                [
                    'author' => [
                        'user' => [
                            'display_name' => 'itsjeffro',
                            'links' => [
                                'avatar' => [
                                    'href' => 'https://path/to/avatar'
                                ]
                            ]
                        ]
                    ],
                    'hash' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                    'links' => [
                        'html' => [
                            'href' => 'https://bitbucket.org/itsjeffro/demo/commits/a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                        ]
                    ]
                ]
            ]
        ];

        $expected = [
            []        
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $bitbucket = new Bitbucket($client,'');

        $this->assertSame($expected, $bitbucket->commits('itsjeffro/deploy'));
    }

    public function test_formatted_commit_endpoint()
    {
        $body = [
            'author' => [
                'user' => [
                    'display_name' => 'itsjeffro',
                    'links' => [
                        'avatar' => [
                            'href' => 'https://path/to/avatar'
                        ]
                    ]
                ]
            ],
            'hash' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
            'links' => [
                'html' => [
                    'href' => 'https://bitbucket.org/itsjeffro/demo/commits/a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                ]
            ]
        ];

        $expected = [
            'display_name' => 'itsjeffro',
            'avatar_link' => 'https://path/to/avatar',
            'hash' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
            'commit_url' => 'https://bitbucket.org/itsjeffro/demo/commits/a588cf368828430b115fc3c3a73e9eb85b7a6b32',
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $bitbucket = new Bitbucket($client,'');

        $this->assertSame($expected, $bitbucket->commit('itsjeffro/deploy', 'a588cf368828430b115fc3c3a73e9eb85b7a6b32'));
    }

    public function test_formatted_repository_endpoint()
    {
        $body = [
            'name' => 'deploy'
        ];

        $expected = [
            'name' => 'deploy'
        ];
    
        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);
        $bitbucket = new Bitbucket($client,'');

        $this->assertSame($expected, $bitbucket->repository('itsjeffro'));
    }

    public function test_formatted_tags_endpoint()
    {
        $body = [
            'values' => [
                [
                    'name' => 'v1.0',
                    'target' => [
                        'hash' => 'a588cf368828430b115fc3c3a73e9eb85b7a6b32',
                    ]
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
        $bitbucket = new Bitbucket($client,'');

        $this->assertSame($expected, $bitbucket->tags('itsjeffro'));
    }
}
