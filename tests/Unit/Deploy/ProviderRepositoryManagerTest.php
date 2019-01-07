<?php

namespace Deploy\Tests\ProviderRepository;

use PHPUnit\Framework\TestCase;
use Deploy\ProviderRepositoryManager;
use Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface;

class ProviderRepositoryManagerTest extends TestCase
{
    public function test_instance_of_ProviderRepositoryInterface()
    {
        $providerRepositoryManager = new ProviderRepositoryManager();
        $driver = $providerRepositoryManager->driver('github');
        $this->assertInstanceOf(ProviderRepositoryInterface::class, $driver);
    }
}
