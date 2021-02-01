<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\EnvironmentResetRequest;
use Deploy\Models\Project;
use Deploy\Models\Environment;
use Deploy\Environment\EnvironmentEncrypter;
use Illuminate\Http\JsonResponse;

class ProjectEnvironmentResetController extends Controller
{
    /** @var EnvironmentEncrypter */
    private $environmentEncrypter;

    /**
     * ProjectEnvironmentResetController constructor.
     */
    public function __construct(EnvironmentEncrypter $environmentEncrypter)
    {
        $this->environmentEncrypter = $environmentEncrypter;
    }

    /**
     * Reset environment.
     */
    public function update(EnvironmentResetRequest $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $encrypter = $this->environmentEncrypter
            ->setKey($request->get('key'));

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
