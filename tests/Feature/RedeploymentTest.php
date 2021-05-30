<?php

namespace Deploy\Tests\Feature;

use Deploy\Jobs\DeployJob;
use Deploy\Models\Deployment;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Queue;

class RedeploymentTest extends TestCase
{
    /**
     * @group deployment
     */
    public function test_user_can_redeploy_project_with_same_commit()
    {
        Queue::fake();

        $deployment = Deployment::factory()->create([
            'commit' => 'OLD_COMMIT',
        ]);

        $response = $this->actingAs($deployment->project->user)
            ->json('POST', route('redeployments.store'), [
                'deployment_id' => $deployment->id,
            ]);

        $response->assertStatus(201);

        Queue::assertPushed(function (DeployJob $job) use ($deployment) {
            return $job->getDeployment()->commit === $deployment->commit;
        });
    }
}
