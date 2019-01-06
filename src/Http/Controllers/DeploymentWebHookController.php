<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Deploy\Jobs\DeployJob;
use Deploy\ProviderRepository\Reference;
use Deploy\DeploymentManager;
use Illuminate\Http\Request;

class DeploymentWebHookController extends Controller
{
    /**
     * Store deployment queue triggered by webhook.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $key)
    {
        $project = Project::where('key', $key)
            ->where('deploy_on_push', 1)
            ->first();

        if (!$project) {
            return response()->json([
                'message' => 'Project does not exist or is not set up for auto deployments.'
            ], 404);
        }

        $repostioryManager = new Reference(Reference::BRANCH_TYPE, $project->branch);
        $deploy = new DeploymentManager($project, $repostioryManager);

        $deployment = $deploy->create();

        dispatch(new DeployJob($deployment, $project));

        return response()->json([
            'message' => $project->repository.':'.$project->branch.' was pushed to and queued for deployment.'
        ]);
    }
}
