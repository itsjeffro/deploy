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
     */
    public function __construct()
    {
        //
    }
    
    /**
     * Show server belonging to user.
     */
    public function view($user, Server $server): bool
    {
        return $user->id === $server->user_id;
    }
    
    /**
     * Update server belonging to user.
     */
    public function update($user, Server $server): bool
    {
        return $user->id === $server->user_id;
    }
    
    /**
     * Delete server belonging to user.
     */
    public function delete($user, Server $server): bool
    {
        return $user->id === $server->user_id;
    }

    /**
     * Creating a server.
     */
    public function create($user)
    {
        return $user !== null;
    }
}
