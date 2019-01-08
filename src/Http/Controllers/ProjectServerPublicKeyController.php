<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Deploy\Models\Server;
use Illuminate\Support\Facades\Storage;

class ProjectServerPublicKeyController extends Controller
{
    /**
     * Display public key for project server.
     *
     * @param \Deploy\Models\Project $project
     * @param \Deploy\Models\Server  $server
     *
     * @return \Illuminate\Http\JsonResponse;
     */
    public function show(Project $project, Server $server)
    {
        if ($project->id !== $server->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('view', $server);

        $publicKey = Storage::get('keys/'.$server->id.'/id_rsa.pub');

        return response()->json(['public_key' => $publicKey]);
    }
}
