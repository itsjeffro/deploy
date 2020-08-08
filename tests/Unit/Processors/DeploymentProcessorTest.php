<?php

namespace Deploy\Tests\Unit;

use Deploy\Models\Deployment;
use Deploy\Processors\AbstractProcessor;
use Deploy\Processors\DeploymentProcessor;
use Deploy\ProviderOauthManager;
use Mockery;
use Orchestra\Testbench\TestCase;

class DeploymentProcessorTest extends TestCase
{
    private $deploymentProcessor;

    protected function setUp(): void
    {
        $providerOauthManager = Mockery::mock(ProviderOauthManager::class);

        $this->deploymentProcessor = new DeploymentProcessor($providerOauthManager);
    }

    protected function tearDown(): void
    {
        Mockery::close();
    }

    public function testInstance()
    {
        $this->assertInstanceOf(AbstractProcessor::class, $this->deploymentProcessor);
    }
}