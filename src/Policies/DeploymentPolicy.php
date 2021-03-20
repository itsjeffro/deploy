<?php

namespace Deploy\Policies;

use Deploy\Models\Deployment;
use Illuminate\Auth\Access\HandlesAuthorization;

class DeploymentPolicy
{
    use HandlesAuthorization;
    
    /**
     * Show deployment belonging to user.
     *
     * @param mixed $user
     */
    public function view($user, Deployment $deployment): bool
    {
        return $user->id === $deployment->project->user_id;
    }
}