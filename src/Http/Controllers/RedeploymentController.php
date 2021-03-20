<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Action;
use Deploy\Models\Deployment;
use Deploy\Jobs\DeployJob;
use Deploy\RedeploymentManager;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RedeploymentController extends Controller
{
    /**
     * Prepare redeployment queue.
     *
     * @throws AuthorizationException
     */
    public function store(Request $request): JsonResponse
    {
        $previousDeployment = Deployment::findOrFail($request->input('deployment_id'));
        $project = $previousDeployment->project;

        $this->authorize('view', $project);

        $redeploy = new RedeploymentManager($previousDeployment);
        $deployment = $redeploy->create();

        dispatch(new DeployJob($deployment, $project));

        return response()->json($deployment, 201);
    }
}
