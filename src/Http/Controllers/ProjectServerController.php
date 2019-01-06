<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ServerRequest;
use Deploy\Models\Project;
use Deploy\Models\Server;
use Deploy\Jobs\CreateServerKeysJob;
use Deploy\Jobs\DeleteServerKeysJob;

class ProjectServerController extends Controller
{
    /**
     * Get server.
     *
     * @param  \Deploy\Models\Project $project
     * @param  \Deploy\Models\Server $server
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project, Server $server)
    {
        if ($project->id !== $server->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('view', $server);

        return response()->json($server);
    }

    /**
     * Save server.
     *
     * @param  \Deploy\Http\Requests\ServerRequest $request
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ServerRequest $request, Project $project)
    {
        $userId = auth()->id();

        if ($project->user_id !== $userId) {
            abort(403, 'Unauthorized action.');
        }

        $server = new Server();
        $server->fill([
            'user_id'      => $userId,
            'project_id'   => $project->id,
            'name'         => $request->get('name'),
            'ip_address'   => $request->get('ip_address'),
            'port'         => $request->get('port'),
            'connect_as'   => $request->get('connect_as'),
            'project_path' => $request->get('project_path'),
        ]);
        $server->save();

        if (!is_dir(storage_path('app/keys'))) {
            mkdir(storage_path('app/keys'));
        }

        dispatch(new CreateServerKeysJob($server));

        return response()->json($server, 201);
    }

    /**
     * Update server.
     *
     * @param  \Deploy\Http\Requests\ServerRequest $request
     * @param  \Deploy\Models\Server $server
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ServerRequest $request, Project $project, Server $server)
    {
        if ($project->id !== $server->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('update', $server);

        $server->fill($request->all());
        $server->save();

        return response()->json($server, 200);
    }

    /**
     * Delete server and queue to remove private key.
     *
     * @param  \App\Project
     * @param  \Deploy\Models\Server $server
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project, Server $server)
    {
        if ($project->id !== $server->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('delete', $server);

        $server->delete();

        dispatch(new DeleteServerKeysJob($server));

        return response()->json(null, 204);
    }
}
