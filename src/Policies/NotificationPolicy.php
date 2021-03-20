<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Notification;
use Illuminate\Auth\Access\HandlesAuthorization;

class NotificationPolicy
{
    use HandlesAuthorization;

    /**
     * Show notification belonging to user.
     *
     * @param mixed $user
     */
    public function view($user, Notification $notification): bool
    {
        return (int) $user->id === (int) $notification->user_id;
    }

    /**
     * Mark notification belong to user as read.
     *
     * @param mixed $user
     */
    public function markAsRead($user, Notification $notification): bool
    {
        return (int) $user->id === (int) $notification->user_id;
    }
}
