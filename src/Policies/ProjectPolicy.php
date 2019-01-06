<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Project;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectPolicy
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
     * Show project belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Project $project
     * @return bool
     */
    public function view(User $user, Project $project)
    {
        return $user->id === $project->user->id;
    }

    /**
     * Update project belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Project $project
     * @return bool
     */
    public function update(User $user, Project $project)
    {
        return $user->id === $project->user->id;
    }

    /**
     * Delete project belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Project $project
     * @return bool
     */
    public function delete(User $user, Project $project)
    {
        return $user->id === $project->user->id;
    }
}