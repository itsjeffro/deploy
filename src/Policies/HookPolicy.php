<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Hook;
use Illuminate\Auth\Access\HandlesAuthorization;

class HookPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the deploymentHook.
     *
     * @param  \App\User  $user
     * @param  \Deploy\Models\Hook  $hook
     * @return mixed
     */
    public function view(User $user, Hook $hook)
    {
        return $user->id === $hook->project->user->id;
    }

    /**
     * Determine whether the user can create deploymentHooks.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the deploymentHook.
     *
     * @param  \App\User  $user
     * @param  \Deploy\Models\Hook  $hook
     * @return mixed
     */
    public function update(User $user, Hook $hook)
    {
        return $user->id === $hook->project->user->id;
    }

    /**
     * Determine whether the user can delete the deploymentHook.
     *
     * @param  \App\User  $user
     * @param  \Deploy\Models\Hook  $hook
     * @return mixed
     */
    public function delete(User $user, Hook $hook)
    {
        return $user->id === $hook->project->user->id;
    }
}