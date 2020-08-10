<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\EnvironmentResetRequest;
use Deploy\Models\Project;
use Deploy\Models\Environment;
use Deploy\Environment\EnvironmentEncrypter;

class ProjectEnvironmentResetController extends Controller
{
    /**
     * Reset environment.
     *
     * @param EnvironmentEncrypter $environmentEncrypter
     * @param EnvironmentResetRequest $request
     * @param Project $project
     * @return JsonResponse
     */
    public function update(EnvironmentEncrypter $environmentEncrypter, EnvironmentResetRequest $request, Project $project)
    {
        $this->authorize('view', $project);

        $encrypter = $environmentEncrypter->setKey($request->get('key'));

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
