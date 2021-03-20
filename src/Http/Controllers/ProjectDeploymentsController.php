<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Deploy\Models\Deployment;
use Deploy\Http\Requests\DeploymentRequest;
use Deploy\Jobs\DeployJob;
use Deploy\ProviderRepository\Reference;
use Deploy\DeploymentManager;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class ProjectDeploymentsController extends Controller
{
    /**
     * List deployments.
     */
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $deployments = Deployment::with('project')
            ->where('project_id', $project->id)
            ->orderBy('id', 'DESC')
            ->limit(5)
            ->get();

        return response()->json($deployments);
    }

    /**
     * Show deployment.
     *
     * @throws AuthorizationException
     */
    public function show(Project $project, Deployment $deployment): JsonResponse
    {
        if ($project->id !== $deployment->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('view', $deployment);

        $deployment = Deployment::with(['project', 'processes' => function($query) {
                return $query->orderBy('sequence', 'ASC');
            }])
            ->find($deployment->id);

        return response()->json($deployment);
    }

    /**
     * Create deployment and dispatch queue.
     *
     * @throws AuthorizationException
     */
    public function store(DeploymentRequest $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $reference = new Reference($request->input('reference'), $request->input('name'));
        $deploy = new DeploymentManager($project, $reference);
        $deployment = $deploy->create();

        dispatch(new DeployJob($deployment, $project));

        return response()->json($deployment, 201);
    }
}
