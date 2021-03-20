<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Deployment;
use Deploy\Models\Process;
use Deploy\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectDeploymentProcessController extends Controller
{
    /**
     * Show process output.
     */
    public function show(Project $project, Deployment $deployment, Process $process): JsonResponse
    {
        if ($project->id !== $deployment->project_id || $deployment->id !== $process->deployment_id) {
            abort(404, 'Not found.');
        }
        
        $this->authorize('view', $process);

        return response()->json($process);
    }
}