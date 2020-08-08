<?php

namespace Deploy\Tests\Unit\ProviderOauth;

use Deploy\Contracts\ProviderOauth\ProviderOauthInterface;
use Deploy\ProviderOauth\ProviderOauthFactory;
use Orchestra\Testbench\TestCase;
use RuntimeException;

class ProviderOauthFactoryTest extends TestCase
{
    public function test_github_returns_correct_instance()
    {
        $githubOauth = ProviderOauthFactory::create('github');

        $this->assertInstanceOf(ProviderOauthInterface::class, $githubOauth);
    }

    public function test_bitbucket_returns_correct_instance()
    {
        $bitbucketOauth = ProviderOauthFactory::create('bitbucket');

        $this->assertInstanceOf(ProviderOauthInterface::class, $bitbucketOauth);
    }

    public function test_invalid_provider_throws_runtime_exception()
    {
        $this->expectException(RuntimeException::class);
        
        ProviderOauthFactory::create('invalid_provider');
    }
}
