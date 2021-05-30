<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\DeployAccessToken;
use Deploy\Models\Provider;
use Deploy\Models\User;
use Deploy\Tests\TestCase;
use Illuminate\Support\Str;

class AccountProviderTest extends TestCase
{
    /**
     * @group provider
     */
    public function test_user_can_their_provider_accounts()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->json('GET', route('account-providers.index'));

        $response
            ->assertStatus(200)
            ->assertJson([
                [
                    'name' => 'Bitbucket',
                    'friendly_name' => 'bitbucket',
                    'url' => 'https://bitbucket.org/',
                    'is_connected' => false,
                ],
                [
                    'name' => 'Github',
                    'friendly_name' => 'github',
                    'url' => 'https://github.com/',
                    'is_connected' => false,
                ],
            ]);
    }

    /**
     * @group provider
     */
    public function test_user_is_connected_to_provider_account()
    {
        $user = User::factory()->create();

        $bitbucket = Provider::where('friendly_name', Provider::BITBUCKET_PROVIDER)->firstOrFail();

        $deployAccessToken = new DeployAccessToken();
        $deployAccessToken->fill([
            'id' => Str::random(),
            'user_id' => $user->id,
            'provider_id' => $bitbucket->id,
            'scopes' => 'repo',
            'token_type' => 'bearer',
        ]);
        $deployAccessToken->save();

        $response = $this
            ->actingAs($user)
            ->json('GET', route('account-providers.index'));

        $response
            ->assertStatus(200)
            ->assertJson([
                [
                    'name' => 'Bitbucket',
                    'friendly_name' => 'bitbucket',
                    'url' => 'https://bitbucket.org/',
                    'is_connected' => true,
                ],
            ]);
    }
}
