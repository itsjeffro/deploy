<?php

namespace Deploy\Http\Controllers;

use Deploy\Jobs\TestConnectionJob;
use Deploy\Models\Project;
use Deploy\Models\Server;

class ProjectServerTestConnectionController extends Controller
{
    /**
     * Get server connection status.
     *
     * @param \Deploy\Models\Project $project
     * @param \Deploy\Models\Server  $server
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Project $project, Server $server)
    {
        if ($project->id !== $server->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('view', $server);

        dispatch(new TestConnectionJob($server));

        return response()->json(null, 204);
    }
}
