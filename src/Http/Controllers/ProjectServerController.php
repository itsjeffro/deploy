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
     * List project's servers.
     */
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $projectServers = ProjectServer::with(['server'])
            ->where('project_id', '=', $project->id)
            ->paginate();

        return response()->json($projectServers);
    }

    /**
     * Get project's server.
     */
    public function show(Project $project, Server $server): JsonResponse
    {
        $projectServer = ProjectServer::with(['server'])
            ->where('project_id', '=', $project->id)
            ->where('server_id', '=', $server->id)
            ->first();

        if (!$projectServer instanceof ProjectServer) {
            abort(404, 'Not found.');
        }

        $this->authorize('view', $project);

        return response()->json($projectServer);
    }

    /**
     * Assign server to project.
     */
    public function store(ProjectServerRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $projectServer = new ProjectServer();
        $projectServer->project_id = $project->id;
        $projectServer->server_id = $request->input('server_id');
        $projectServer->project_path = $request->input('project_path');
        $projectServer->save();

        return response()->json(null, 201);
    }

    /**
     * Update project server pivot record.
     */
    public function update(ProjectServerRequest $request, Project $project, Server $server): JsonResponse
    {
        $projectServer = ProjectServer::where('project_id', '=', $project->id)
            ->where('server_id', '=', $server->id)
            ->first();

        if (!$projectServer instanceof ProjectServer) {
            abort(404, 'Not found.');
        }

        $this->authorize('update', $projectServer);

        $projectServer->server_id = $request->input('server_id');
        $projectServer->project_path = $request->input('project_path');
        $projectServer->save();

        return response()->json($projectServer, 200);
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
