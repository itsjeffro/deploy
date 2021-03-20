<?php

namespace Deploy\Tests\Feature;

use Deploy\Jobs\DeployJob;
use Deploy\Models\Project;
use Deploy\Tests\TestCase;
use Illuminate\Support\Facades\Queue;

class DeploymentWebHookTest extends TestCase
{
    /**
     * @group deploymentWebhook
     */
    public function test_user_can_trigger_deployment_webhook()
    {
        Queue::fake();

        $project = factory(Project::class)->create([
            'repository' => 'REPOSITORY_URL',
            'branch' => 'BRANCH_NAME',
            'deploy_on_push' => 1,
            'key' => 'RANDOM_KEY_1',
        ]);

        $response = $this->actingAs($project->user)
            ->json('POST', route('webhook.store', [
                'key' => $project->key
            ]));

        $response
            ->assertStatus(200)
            ->assertJson([
                'message' => "{$project->repository}:{$project->branch} was pushed to and queued for deployment.",
            ]);

        Queue::assertPushed(function (DeployJob $job) use ($project) {
            return $job->getDeployment()->project_id === $project->id
                && $job->getDeployment()->repository === 'REPOSITORY_URL'
                && $job->getDeployment()->branch === 'BRANCH_NAME';
        });
    }

    /**
     * @group deploymentWebhook
     */
    public function test_user_cannot_trigger_deployment_webhook_with_deploy_on_push_false()
    {
        Queue::fake();

        $project = factory(Project::class)->create([
            'deploy_on_push' => 0,
            'key' => 'RANDOM_KEY_2',
        ]);

        $response = $this->actingAs($project->user)
            ->json('POST', route('webhook.store', [
                'key' => 'RANDOM_KEY_2'
            ]));

        $response->assertStatus(404);
    }


    /**
     * @group deploymentWebhook
     */
    public function test_user_cannot_trigger_deployment_webhook_with_invalid_key()
    {
        Queue::fake();

        $project = factory(Project::class)->create([
            'deploy_on_push' => 1,
            'key' => 'RANDOM_KEY_3',
        ]);

        $response = $this->actingAs($project->user)
            ->json('POST', route('webhook.store', [
                'key' => 'INVALID_KEY'
            ]));

        $response->assertStatus(404);
    }
}