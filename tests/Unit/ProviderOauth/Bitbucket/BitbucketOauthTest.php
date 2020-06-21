<?php

namespace Deploy\Tests\Unit;

use Deploy\ProviderOauth\Bitbucket\BitbucketOauth;
use Deploy\ProviderOauth\Bitbucket\BitbucketOauthResource;
use GuzzleHttp\Client;
use GuzzleHttp\Handler\MockHandler;
use GuzzleHttp\HandlerStack;
use GuzzleHttp\Psr7\Response;
use Mockery;
use PHPUnit\Framework\TestCase;

class BitbucketOauthTest extends TestCase
{
    public function test_defaults()
    {
        $bitbucketOauth = new BitbucketOauth('','');

        $this->assertNotEmpty($bitbucketOauth->getApiUrl());
        $this->assertTrue($bitbucketOauth->hasRefreshToken());
    }

    public function test_access_token_was_successfully_requested()
    {
        $body = [
            'scopes' => 'project account webhook',
            'access_token' => 'random_access_token',
            'expires_in' => 7200,
            'token_type' => 'bearer',
            'state' => 'authorization_code',
            'refresh_token' => 'random_refresh_token',
        ];

        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $bitbucketOauth = new BitbucketOauth('','');
        $bitbucketOauth->setHttpClient($client);

        $response = $bitbucketOauth->requestAccessToken('authorization_code');

        $this->assertInstanceOf(BitbucketOauthResource::class, $response);
        $this->assertEquals($body['scopes'], $response->getScopes());
        $this->assertEquals($body['access_token'], $response->getAccessToken());
        $this->assertEquals($body['expires_in'], $response->getExpiration());
        $this->assertEquals($body['token_type'], $response->getTokenType());
        $this->assertEquals($body['refresh_token'], $response->getRefreshToken());
    }

    public function test_refresh_token_was_successfully_requested()
    {
        $body = [
            'scopes' => 'project account webhook',
            'access_token' => 'random_access_token',
            'expires_in' => 7200,
            'token_type' => 'bearer',
            'state' => 'refresh_token',
            'refresh_token' => 'random_refresh_token',
        ];

        $mock = new MockHandler([
            new Response(200, [], json_encode($body)),
        ]);
        
        $handlerStack = HandlerStack::create($mock);
        $client = new Client(['handler' => $handlerStack]);

        $bitbucketOauth = new BitbucketOauth('','');
        $bitbucketOauth->setHttpClient($client);

        $response = $bitbucketOauth->refreshAccessToken('random_refresh_token');

        $this->assertInstanceOf(BitbucketOauthResource::class, $response);
        $this->assertEquals($body['scopes'], $response->getScopes());
        $this->assertEquals($body['access_token'], $response->getAccessToken());
        $this->assertEquals($body['expires_in'], $response->getExpiration());
        $this->assertEquals($body['token_type'], $response->getTokenType());
        $this->assertEquals($body['refresh_token'], $response->getRefreshToken());
    }
}
