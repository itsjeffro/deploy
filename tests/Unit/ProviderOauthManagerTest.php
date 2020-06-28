<?php

namespace Deploy\Tests\Unit;

use Deploy\ProviderOauth\Bitbucket\BitbucketOauth;
use Deploy\ProviderOauthManager;
use Illuminate\Contracts\Config\Repository;
use Mockery;
use PHPUnit\Framework\TestCase;
use stdClass;

class ProviderOauthManagerTest extends TestCase
{
    private $providerOauthManager;

    protected function setUp(): void
    {
        $config = Mockery::mock(Repository::class);
        $config->shouldReceive('get')->with('deploy.providers.bitbucket.oauth')->andReturn(BitbucketOauth::class);
        $config->shouldReceive('get')->with('deploy.providers.bitbucket.key')->andReturn('client_id');
        $config->shouldReceive('get')->with('deploy.providers.bitbucket.secret')->andReturn('client_secret');

        $user = Mockery::mock(stdClass::class);
    
        $provider = Mockery::mock(stdClass::class);
        $provider->friendly_name = 'bitbucket';

        $this->providerOauthManager = new ProviderOauthManager($config);

        $this->providerOauthManager
            ->setUser($user)
            ->setProvider($provider);
    }

    protected function tearDown(): void
    {
        \Mockery::close();
    }

    public function test_that_authorize_url_is_returned()
    {
        $authorizationUrl = $this->providerOauthManager->getAuthorizeUrl();

        $this->assertEquals(
            'https://bitbucket.org/site/oauth2/authorize?client_id=client_id&response_type=code',
            $authorizationUrl
        );
    }
}
