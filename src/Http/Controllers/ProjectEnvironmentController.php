<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\EnvironmentRequest;
use Deploy\Jobs\WriteEnvironmemtJob;
use Deploy\Models\Project;
use Deploy\Models\Environment;
use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Models\Server;

class ProjectEnvironmentController extends Controller
{
    /**
     * Update environment.
     *
     * @param EnvironmentRequest $request
     * @param Project $project
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(EnvironmentRequest $request, Project $project)
    {
        $this->authorize('view', $project);

        $environment = Environment::where('project_id', $project->id)->first();

        $encrypter = new EnvironmentEncrypter($request->get('key'));

        if (!$environment) {
            return response()->json(
                sprintf('Environment does not exist for project with id %i', $project->id),
                404
            );
        }

        $environment->contents = $encrypter->encrypt($request->get('contents'));
        $environment->save();

        // Sync servers to environment
        $servers = Server::where('project_id', $project->id)
            ->whereIn('id', $request->get('servers'))
            ->get()
            ->pluck('id')
            ->toArray();

        if (is_array($servers)) {
            $environment->environmentServers()->sync($servers);
        }

        dispatch(new WriteEnvironmemtJob($project, $environment, $request->get('key')));

        return response()->json(null, 204);
    }
}
