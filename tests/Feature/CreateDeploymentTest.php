<?php

namespace Deploy\Tests\Feature;

use Deploy\DeploymentManager;
use Deploy\Models\Project;
use Deploy\ProviderRepository\Reference;
use Deploy\Tests\TestCase;

class CreateDeploymentTest extends TestCase
{
    public function test_successfully_created_deployment()
    {
        $project = factory(Project::class)->create();

        $reference = new Reference(Reference::BRANCH_TYPE, 'master');

        $deploymentManager = new DeploymentManager($project, $reference);

        $deployment = $deploymentManager->create();

        $this->assertSame('https://github.com/itsjeffro/deploy.git', $deployment->repository);
        $this->assertSame('branch', $deployment->reference);
        $this->assertSame('master', $deployment->branch);
    }
}
