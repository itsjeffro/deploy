<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Process;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProcessPolicy
{
    use HandlesAuthorization;

    /**
     * Show deploymentStepProgress belonging to user.
     *
     * @param mixed $user
     */
    public function view($user, Process $process): bool
    {
        return $user->id === $process->deployment->project->user_id;
    }
}
