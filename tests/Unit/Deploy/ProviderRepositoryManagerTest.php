<?php

namespace Deploy\Tests\Unit\ProviderRepository;

use PHPUnit\Framework\TestCase;
use Deploy\ProviderRepositoryManager;
use Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface;

class ProviderRepositoryManagerTest extends TestCase
{
    public function testInstanceOfProviderRepositoryInterface()
    {
        $providerRepositoryManager = new ProviderRepositoryManager();
        $driver = $providerRepositoryManager->driver('github');
        $this->assertInstanceOf(ProviderRepositoryInterface::class, $driver);
    }
}
