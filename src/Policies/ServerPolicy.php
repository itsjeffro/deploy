<?php

namespace Deploy\Policies;

use App\User;
use Deploy\Models\Server;
use Illuminate\Auth\Access\HandlesAuthorization;

class ServerPolicy
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
    
    /* Show server belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Server $server
     * @return bool
     */
    public function view(User $user, Server $server)
    {
        return $user->id === $server->project->user_id;
    }
    
    /**
     * Update server belonging to user.
     *
     * @param \App\User $user
     * @param \Deploy\Models\Server $server
     * @return bool
     */
    public function update(User $user, Server $server)
    {
        return $user->id === $server->project->user_id;
    }
    
    /**
     * Delete server belonging to user.
     *
     * @param  \App\User $user
     * @param  \Deploy\Models\Server $server
     * @return bool
     */
    public function delete(User $user, Server $server)
    {
        return $user->id === $server->project->user_id;
    }
}