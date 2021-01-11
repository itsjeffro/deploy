<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ServerRequest;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Illuminate\Http\JsonResponse;

class ProjectServerController extends Controller
{
    /**
     * Assign server to project.
     */
    public function store(ServerRequest $request, Project $project)
    {
        return response()->json(null, 201);
    }

    /**
     * Remove server from project. This will not actually delete the server.
     */
    public function destroy(Project $project, Server $server): JsonResponse
    {
        $projectServer = ProjectServer::where('project_id', '=', $project->id)
            ->where('server_id', '=', $server->id)
            ->first();

        if (!$projectServer instanceof ProjectServer) {
            abort(404, 'Not found.');
        }

        $this->authorize('delete', $projectServer);

        $server->delete();

        return response()->json(null, 204);
    }
}
