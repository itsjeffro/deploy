<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Process;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProcessPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Show deploymentStepProgress belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Process $process
     * @return bool
     */
    public function view(User $user, Process $process)
    {
        return $user->id === $process->deployment->project->user_id;
    }
}