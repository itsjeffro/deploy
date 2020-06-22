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
}
