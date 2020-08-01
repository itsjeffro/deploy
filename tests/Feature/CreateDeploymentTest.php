<?php

namespace Deploy\Tests\Feature;

use Deploy\DeploymentManager;
use Deploy\Models\Project;
use Deploy\ProviderRepository\Reference;
use Deploy\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CreateDeploymentTest extends TestCase
{
    use RefreshDatabase;

    public function test_successfully_created_deployment()
    {
        $project = factory(Project::class)->create([
            'repository' => 'https://github.com/itsjeffro/deploy.git',
            'branch' => 'master',
            'provider_id' => 1,
            'user_id' => 1,
            'key' => 'ssh-rsa random-public-key',
        ]);

        $reference = new Reference(Reference::BRANCH_TYPE, 'master');

        $deploymentManager = new DeploymentManager($project, $reference);

        $deployment = $deploymentManager->create();

        $this->assertSame('https://github.com/itsjeffro/deploy.git', $deployment->repository);
        $this->assertSame('branch', $deployment->reference);
        $this->assertSame('master', $deployment->branch);
    }
}
