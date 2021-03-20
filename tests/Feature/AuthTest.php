<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\User;
use Deploy\Tests\TestCase;

class AuthTest extends TestCase
{
    /**
     * @group auth
     */
    public function test_user_can_their_details()
    {
        $user = factory(User::class)->create();

        $response = $this
            ->actingAs($user)
            ->json('GET', route('deploy.me'));

        $response->assertStatus(200);
    }
}
