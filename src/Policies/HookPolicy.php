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
     * @param mixed $user
     */
    public function view($user, Hook $hook): bool
    {
        return $user->id === $hook->project->user->id;
    }

    /**
     * Determine whether the user can create deploymentHooks.
     *
     * @param mixed $user
     * @return mixed
     */
    public function create($user)
    {
        //
    }

    /**
     * Determine whether the user can update the deploymentHook.
     *
     * @param mixed $user
     */
    public function update($user, Hook $hook): bool
    {
        return $user->id === $hook->project->user->id;
    }

    /**
     * Determine whether the user can delete the deploymentHook.
     *
     * @param mixed $user
     */
    public function delete($user, Hook $hook): bool
    {
        return $user->id === $hook->project->user->id;
    }
}