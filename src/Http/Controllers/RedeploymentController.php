<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Action;
use Deploy\Models\Deployment;
use Deploy\Jobs\DeployJob;
use Deploy\RedeploymentManager;
use Illuminate\Http\Request;

class RedeploymentController extends Controller
{
    /**
     * Prepare redeployment queue.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Action $action)
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