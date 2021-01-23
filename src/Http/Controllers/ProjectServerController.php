<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ProjectServerRequest;
use Deploy\Models\Project;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Illuminate\Http\JsonResponse;

class ProjectServerController extends Controller
{
    /**
     * Assign server to project.
     */
    public function store(ProjectServerRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $projectServer = new ProjectServer();
        $projectServer->project_id = $project->id;
        $projectServer->server_id = $request->input('server_id');
        $projectServer->save();

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

        $projectServer->delete();

        return response()->json(null, 204);
    }
}
