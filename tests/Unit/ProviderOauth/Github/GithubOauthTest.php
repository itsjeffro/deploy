<?php

namespace Deploy\Tests\Unit;

use Deploy\ProviderOauth\Github\GithubOauth;
use Deploy\ProviderOauth\Github\GithubOauthResource;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use PHPUnit\Framework\TestCase;

class GithubOauthTest extends TestCase
{
    public function test_defaults()
    {
        $githubOauth = new GithubOauth('','');

        $this->assertNotEmpty($githubOauth->getApiUrl());
        $this->assertFalse($githubOauth->hasRefreshToken());
    }

    public function test_access_token_was_successfully_requested()
    {
        $body = [
            'scope' => 'repo',
            'access_token' => 'random_access_token',
            'token_type' => 'bearer',
        ];

        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $bitbucketOauth = new GithubOauth('','');
        $bitbucketOauth->setHttpClient($client);

        $response = $bitbucketOauth->requestAccessToken('authorization_code');

        $this->assertInstanceOf(GithubOauthResource::class, $response);
        $this->assertEquals($body['scope'], $response->getScopes());
        $this->assertEquals($body['access_token'], $response->getAccessToken());
        $this->assertEquals($body['token_type'], $response->getTokenType());
        $this->assertSame(0, $response->getExpiration());
        $this->assertSame('', $response->getRefreshToken());
    }

    public function test_refresh_token_is_not_provided_by_github()
    {
        $githubOauth = new GithubOauth('','');

        $response = $githubOauth->refreshAccessToken('random_refresh_token');

        $this->assertEmpty($response);
    }
}
