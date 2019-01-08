<?php

namespace Deploy\Http\Controllers;

use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Http\Requests\EnvironmentRequest;
use Deploy\Models\Environment;
use Deploy\Models\Project;

class ProjectEnvironmentResetController extends Controller
{
    /**
     * Reset environment.
     *
     * @param \Deploy\Http\Requests\EnvironmentRequest $request
     * @param \Deploy\Models\Project                   $project
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(EnvironmentRequest $request, Project $project)
    {
        $this->authorize('view', $project);

        $encrypter = new EnvironmentEncrypter($request->get('key'));
        $environment = Environment::where('project_id', $project->id)->first();

        if (!$environment) {
            $environment = new Environment();
            $environment->project_id = $project->id;
            $environment->contents = $encrypter->encrypt('');
            $environment->save();

            return response()->json(['environment' => '']);
        }

        $environment->contents = $encrypter->encrypt('');
        $environment->save();

        return response()->json(null, 204);
    }
}
