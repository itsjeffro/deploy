<?php

namespace Deploy\Tests\Feature;

use Deploy\Models\Notification;
use Deploy\Tests\TestCase;

class NotificationTest extends TestCase
{
    /**
     * @group notification
     */
    public function test_user_can_view_notifications()
    {
        $notification = Notification::factory()->create([
            'model_type' => '\App\Class',
            'model_id' => '1',
            'reason' => 'REASON_FOR_NOTIFICATION',
            'subject' => 'SUBJECT',
        ]);

        $response = $this->actingAs($notification->user)
            ->json('GET', route('notifications.index'));

        $response
            ->assertStatus(200)
            ->assertJson([
                'data' => [
                    [
                        'id' => $notification->id,
                        'user_id' => $notification->user->id,
                        'model_type' => $notification->model_type,
                        'model_id' => $notification->model_id,
                        'subject' => $notification->subject,
                        'reason' => $notification->reason,
                        'contents' => $notification->contents,
                        'is_read' => $notification->is_read,
                    ]
                ]
            ]);
    }

    /**
     * @group notification
     */
    public function test_user_can_view_one_notification()
    {
        $notification = Notification::factory()->create([
            'model_type' => '\App\Class',
            'model_id' => '1',
            'reason' => 'REASON_FOR_NOTIFICATION',
            'subject' => 'SUBJECT',
        ]);

        $response = $this->actingAs($notification->user)
            ->json('GET', route('notifications.show', [
                'notification' => $notification
            ]));

        $response
            ->assertStatus(200)
            ->assertJson([
                'id' => $notification->id,
                'user_id' => $notification->user->id,
                'model_type' => $notification->model_type,
                'model_id' => $notification->model_id,
                'subject' => $notification->subject,
                'reason' => $notification->reason,
                'contents' => $notification->contents,
                'is_read' => $notification->is_read,
            ]);
    }
}
