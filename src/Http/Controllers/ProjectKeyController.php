<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Illuminate\Http\Request;

class ProjectKeyController extends Controller
{
    /**
     * Refreshes the key used for authenticating the deployments webhook trigger.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Deploy\Models\Project   $project
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->key = str_random(40);
        $project->save();

        return response()->json([
            'key' => $project->key,
        ]);
    }
}
