<?php

namespace Deploy\Tests\Integration;

use Deploy\Models\Deployment;
use Deploy\RedeploymentManager;
use Deploy\Tests\TestCase;

class CreateRedeploymentTest extends TestCase
{
    public function test_successfully_created_redeployment()
    {
        $deployment = factory(Deployment::class)->create();

        $deploymentManager = new RedeploymentManager($deployment);

        $redeployment = $deploymentManager->create();

        $this->assertSame($deployment->repository, $redeployment->repository);
        $this->assertSame($deployment->reference, $redeployment->reference);
        $this->assertSame($deployment->branch, $redeployment->branch);
        $this->assertSame($deployment->committer, $redeployment->committer);
        $this->assertSame($deployment->committer_avatar, $redeployment->committer_avatar);
        $this->assertSame($deployment->commit, $redeployment->commit);
        $this->assertSame($deployment->commit_url, $redeployment->commit_url);
    }
}
