<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Deployment;
use Deploy\Models\Process;
use Deploy\Models\Project;

class ProjectDeploymentProcessController extends Controller
{
    /**
     * Show process output.
     *
     * @param \Deploy\Models\Project    $project
     * @param \Deploy\Models\Deployment $deployment
     * @param \Deploy\Models\Process    $process
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Project $project, Deployment $deployment, Process $process)
    {
        if ($project->id !== $deployment->project_id || $deployment->id !== $process->deployment_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('view', $process);

        return response()->json($process);
    }
}
