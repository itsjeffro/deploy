<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\EnvironmentUnlockRequest;
use Deploy\Models\Project;
use Deploy\Models\Environment;
use Deploy\Environment\EnvironmentEncrypter;
use Exception;
use Illuminate\Support\Facades\Log;

class ProjectEnvironmentUnlockController extends Controller
{
    /**
     * Unlock environment.
     *
     * @param EnvironmentEncrypter $environmentEncrypter
     * @param EnvironmentUnlockRequest $request
     * @param Project $project
     * @return JsonResponse
     */
    public function store(EnvironmentEncrypter $environmentEncrypter, EnvironmentUnlockRequest $request, Project $project)
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

        try {
            $contents = $encrypter->decrypt($environment->contents);

            return response()->json(['contents' => $contents]);
        } catch (Exception $e) {
            Log::info($e->getTraceAsString());

            return response()->json([
                'key' => [
                    'Invalid environment key.'
                ]
            ], 422);
        }
    }
}
