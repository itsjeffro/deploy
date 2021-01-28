<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProjectServerPolicy
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
     * Show project server belonging to user.
     */
    public function view($user, ProjectServer $projectServer): bool
    {
        return $user->id === $projectServer->project->user_id;
    }

    /**
     * Update project server belonging to user.
     */
    public function update($user, ProjectServer $projectServer): bool
    {
        return $user->id === $projectServer->project->user_id;
    }

    /**
     * Delete project belonging to user.
     */
    public function delete($user, ProjectServer $projectServer): bool
    {
        return $user->id === $projectServer->project->user_id;
    }
}