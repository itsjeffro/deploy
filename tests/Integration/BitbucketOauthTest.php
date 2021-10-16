<?php

namespace Deploy\Tests\Integration;

use Deploy\Models\DeployAccessToken;
use Deploy\Models\DeployRefreshToken;
use Deploy\Models\Provider;
use Deploy\Models\User;
use Deploy\ProviderOauth\Bitbucket\BitbucketOauth;
use Deploy\ProviderOauth\Bitbucket\BitbucketOauthResource;
use Deploy\ProviderOauthManager;
use Deploy\Tests\TestCase;
use Exception;
use Illuminate\Support\Carbon;

class BitbucketOauthTest extends TestCase
{
    /**
     * @var int
     */
    const TWO_HOURS_IN_SECONDS = 7200;

    /**
     * @group oauth
     */
    public function test_get_non_existent_token_throws_exception()
    {
        $this->expectException(Exception::class);

        $user = User::factory()->create();

        $bitbucketProvider = \Mockery::mock(BitbucketOauth::class)->makePartial();

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($bitbucketProvider);
        $providerOauthManager->setUser($user);

        $providerOauthManager->getAccessToken();
    }

    /**
     * @group oauth
     */
    public function test_successfully_request_new_token()
    {
        $user = User::factory()->create();

        $this->createAccessToken($user);

        $newAccessToken = new BitbucketOauthResource([
            'access_token' => '::NEW_ACCESS_TOKEN::',
            'refresh_token' => '::NEW_REFRESH_TOKEN::',
            'token_type' => 'bearer',
            'scopes' => 'project',
            'expires_in' => time() + self::TWO_HOURS_IN_SECONDS,
        ]);

        $bitbucketProvider = \Mockery::mock(BitbucketOauth::class)->makePartial();
        $bitbucketProvider->shouldReceive('requestAccessToken')->andReturn($newAccessToken);
        $bitbucketProvider->shouldReceive('refreshAccessToken')->andReturn($newAccessToken);

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($bitbucketProvider);
        $providerOauthManager->setUser($user);

        $requestedToken = $providerOauthManager->requestAccessToken('::BITBUCKET_AUTH_CODE::');
        $storedToken = $providerOauthManager->getAccessToken();

        $this->assertSame($requestedToken, $storedToken);
    }

    /**
     * @group oauth
     */
    public function test_expired_token_returns_refreshed_token()
    {
        $user = User::factory()->create();

        $newAccessToken = new BitbucketOauthResource([
            'access_token' => '::NEW_ACCESS_TOKEN::',
            'refresh_token' => '::NEW_REFRESH_TOKEN::',
            'token_type' => 'bearer',
            'scopes' => 'project',
            'expires_in' => time(),
        ]);

        $bitbucketProvider = \Mockery::mock(BitbucketOauth::class)->makePartial();
        $bitbucketProvider->shouldReceive('requestAccessToken')->andReturn($newAccessToken);
        $bitbucketProvider->shouldReceive('refreshAccessToken')->andReturn($newAccessToken);

        // Set up data
        $oldAccessToken = $this->createAccessToken($user);

        // Actual test
        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($bitbucketProvider);
        $providerOauthManager->setUser($user);

        $refreshedToken = $providerOauthManager->getAccessToken();

        $this->assertNotSame($oldAccessToken->id, $refreshedToken);
    }

    /**
     * @group oauth
     */
    public function test_get_authorisation_url()
    {
        $user = User::factory()->create();

        $bitbucketProvider = \Mockery::mock(BitbucketOauth::class)->makePartial();

        $providerOauthManager = new ProviderOauthManager;
        $providerOauthManager->setProvider($bitbucketProvider);
        $providerOauthManager->setUser($user);

        $this->assertNotEmpty($providerOauthManager->getAuthorizeUrl());
    }

    private function createAccessToken(User $user): DeployAccessToken
    {
        $provider = Provider::where('friendly_name', Provider::BITBUCKET_PROVIDER)->firstOrFail();

        $accessToken = DeployAccessToken::factory()->create([
            'id' => '::OLD_ACCESS_TOKEN::',
            'user_id' => $user->getKey(),
            'provider_id' => $provider->getKey(),
            'expires_at' => Carbon::now()->subDay(),
        ]);

        DeployRefreshToken::factory()->create([
            'id' => '::REFRESH_TOKEN::',
            'deploy_access_token_id' => $accessToken->getKey(),
            'expires_at' => Carbon::now()->addDay(),
        ]);

        return $accessToken;
    }
}
