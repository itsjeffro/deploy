<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Deployment;
use Illuminate\Auth\Access\HandlesAuthorization;

class DeploymentPolicy
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
     * Show deployment belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Deployment $deployment
     * @return bool
     */
    public function view(User $user, Deployment $deployment)
    {
        return $user->id === $deployment->project->user_id;
    }
}