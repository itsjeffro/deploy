<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Server;

class ServerController extends Controller
{
    /**
     * Get servers.
     */
    public function index()
    {
        $user = auth()->id();

        $servers = Server::where('user_id', $user)->paginate();

        return response()->json($servers);
    }
}
