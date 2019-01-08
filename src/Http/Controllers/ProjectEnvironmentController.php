<?php

namespace Deploy\Http\Controllers;

use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Http\Requests\EnvironmentRequest;
use Deploy\Jobs\WriteEnvironmemtJob;
use Deploy\Models\Environment;
use Deploy\Models\Project;

class ProjectEnvironmentController extends Controller
{
    /**
     * Update environment.
     *
     * @param \Deploy\Http\Requests\EnvironmentRequest $request
     * @param \Deploy\Models\Project                   $project
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(EnvironmentRequest $request, Project $project)
    {
        $this->authorize('view', $project);

        $environment = Environment::where('project_id', $project->id)->first();

        $encrypter = new EnvironmentEncrypter($request->get('key'));

        if (!$environment) {
            return response()->json('Environment does not exist for project.', 404);
        }

        $environment->contents = $encrypter->encrypt($request->get('contents'));
        $environment->save();

        dispatch(new WriteEnvironmemtJob($project, $environment, $request->get('key')));

        return response()->json(null, 204);
    }
}
