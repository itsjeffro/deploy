<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Deployment;
use Deploy\RedeploymentManager;
use Deploy\Tests\TestCase;

class CreateRedeploymentTest extends TestCase
{
    public function test_successfully_created_deployment()
    {
        $deployment = factory(Deployment::class)->create();

        $deploymentManager = new RedeploymentManager($deployment);

        $deployment = $deploymentManager->create();

        $this->assertSame('https://github.com/itsjeffro/deploy.git', $deployment->repository);
        $this->assertSame('branch', $deployment->reference);
        $this->assertSame('master', $deployment->branch);
    }
}
