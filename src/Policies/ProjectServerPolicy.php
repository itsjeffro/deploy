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
     * Delete project belonging to user.
     */
    public function delete($user, ProjectServer $projectServer): bool
    {
        return $user->id === $projectServer->project->user_id;
    }
}