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
     *
     * @param \App\User $user
     * @param \Deploy\Models\Folder $folder
     * @return bool
     */
    public function view(User $user, Folder $folder)
    {
        return $user->id === $folder->project->user_id;
    }

    /**
     * Update project's folder belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Folder $folder
     * @return bool
     */
    public function update(User $user, Folder $folder)
    {
        return $user->id === $folder->project->user_id;
    }

    /**
     * Delete project's folder belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Folder $folder
     * @return bool
     */
    public function delete(User $user, Folder $folder)
    {
        return $user->id === $folder->project->user_id;
    }
}