<?php

namespace Deploy\Tests\Unit;

use Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface;
use Deploy\ProviderRepositoryManager;
use Orchestra\Testbench\TestCase;

class ProviderRepositoryManagerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        config([
            'deploy.providers' => [
                'github' => [
                    'repository' => \Deploy\ProviderRepository\Github\Github::class,
                ]
            ]
        ]);
    }

    public function test_provider_returns_correct_instance()
    {
        $providerRepositoryManager = new ProviderRepositoryManager;

        $githubDriver = $providerRepositoryManager->driver('github');

        $this->assertInstanceOf(ProviderRepositoryInterface::class, $githubDriver);
    }

    public function test_invalid_provider_throws_exception()
    {
        $this->expectException(\InvalidArgumentException::class);

        $providerRepositoryManager = new ProviderRepositoryManager;

        $githubDriver = $providerRepositoryManager->driver('invalid_provider');
    }
}
