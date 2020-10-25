<?php

namespace Deploy\Tests\Integration;

use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;
use Deploy\Models\DeployAccessToken;
use Deploy\Models\DeployRefreshToken;
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
        $token = $this->mockProviderOauthWithAccessToken('bitbucket_requested_access_token_value');

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

    public function test_expired_token_returns_refreshed_token()
    {
        $expirationDate = new \DateTime();
        $expirationDate->sub(new \DateInterval('P1D'));

        $token = $this->mockProviderOauthWithAccessToken('bitbucket_new_access_token_value');

        $provider = \Mockery::mock(BitbucketOauth::class)->makePartial();
        $provider->shouldReceive('requestAccessToken')->andReturn($token);
        $provider->shouldReceive('refreshAccessToken')->andReturn($token);

        $user = factory(User::class)->create();

        $oldAccessToken = factory(DeployAccessToken::class)->create([
            'id' => 'bitbucket_old_access_token_value',
            'provider_id' => 1,
            'user_id' => $user,
            'scopes' => 'account webhook project',
            'expires_at' => $expirationDate,
        ]);

        $refreshToken = factory(DeployRefreshToken::class)->create([
            'id' => 'bitbucket_refresh_token_value',
            'deploy_access_token_id' => 'bitbucket_old_access_token_value',
            'revoked' => 0,
            'expires_at' => $expirationDate,
        ]);

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($provider);
        $providerOauthManager->setUser($user);

        $refreshedToken = $providerOauthManager->getAccessToken();

        $this->assertNotSame($oldAccessToken->id, $refreshedToken);
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

    private function mockProviderOauthWithAccessToken(string $accessTokenId)
    {
        $token = \Mockery::mock(ProviderOauthResourceInterface::class);
        $token->shouldReceive('getAccessToken')->andReturn($accessTokenId);
        $token->shouldReceive('getRefreshToken')->andReturn('refresh_token_value');
        $token->shouldReceive('getScopes')->andReturn('account webhook project');
        $token->shouldReceive('getTokenType')->andReturn('bearer');
        $token->shouldReceive('getExpiration')->andReturn(self::TWO_HOURS_IN_SECONDS);

        return $token;
    }
}
