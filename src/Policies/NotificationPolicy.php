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
     * @param User $user
     * @param Notification $notification
     * @return bool
     */
    public function view(User $user, Notification $notification)
    {
        return (int) $user->id === (int) $notification->project->user_id;
    }

    /**
     * Mark notification belong to user as read.
     *
     * @param User $user
     * @param Notification $notification
     * @return bool
     */
    public function markAsRead(User $user, Notification $notification)
    {
        return (int) $user->id === (int) $notification->project->user_id;
    }
}
