<?php

namespace Deploy\Tests\Feature;

use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;
use Deploy\Models\User;
use Deploy\ProviderOauth\Bitbucket\BitbucketOauth;
use Deploy\ProviderOauthManager;
use Deploy\Tests\TestCase;
use Exception;

class BitbucketOauthTest extends TestCase
{
    const TWO_HOURS_IN_SECONDS = 7200;

    public function test_get_non_existent_token_throws_exception()
    {
        $this->expectException(Exception::class);

        $provider = \Mockery::mock(BitbucketOauth::class)->makePartial();
        $user = factory(User::class)->create();

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($provider);
        $providerOauthManager->setUser($user);

        $providerOauthManager->getAccessToken();
    }

    public function test_successfuly_request_new_token()
    {
        $token = \Mockery::mock(ProviderOauthResourceInterface::class);
        $token->shouldReceive('getAccessToken')->andReturn('bitbucket_access_token_value');
        $token->shouldReceive('getRefreshToken')->andReturn('refresh_token_value');
        $token->shouldReceive('getScopes')->andReturn('account webhook project');
        $token->shouldReceive('getTokenType')->andReturn('bearer');
        $token->shouldReceive('getExpiration')->andReturn(self::TWO_HOURS_IN_SECONDS);

        $provider = \Mockery::mock(BitbucketOauth::class)->makePartial();
        $provider->shouldReceive('requestAccessToken')->andReturn($token);
        $provider->shouldReceive('refreshAccessToken')->andReturn($token);

        $user = factory(User::class)->create();

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($provider);
        $providerOauthManager->setUser($user);

        $requestedToken = $providerOauthManager->requestAccessToken('authorization_code');
        $storedToken = $providerOauthManager->getAccessToken();

        $this->assertSame($requestedToken, $storedToken);
    }

    public function test_get_authorizatoin_url()
    {
        $provider = \Mockery::mock(BitbucketOauth::class)->makePartial();
        $user = factory(User::class)->create();

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($provider);
        $providerOauthManager->setUser($user);

        $this->assertNotEmpty($providerOauthManager->getAuthorizeUrl());
    }
}
