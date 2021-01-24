<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Folder;
use Illuminate\Auth\Access\HandlesAuthorization;

class FolderPolicy
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
     * Show project's folder belonging to user.
     */
    public function view($user, Folder $folder): bool
    {
        return $user->id === $folder->project->user_id;
    }

    /**
     * Update project's folder belonging to user.
     */
    public function update($user, Folder $folder): bool
    {
        return $user->id === $folder->project->user_id;
    }

    /**
     * Delete project's folder belonging to user.
     */
    public function delete($user, Folder $folder): bool
    {
        return $user->id === $folder->project->user_id;
    }
}