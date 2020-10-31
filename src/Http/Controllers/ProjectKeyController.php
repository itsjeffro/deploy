<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectKeyController extends Controller
{
    /**
     * Refreshes the key used for authenticating the deployments webhook trigger.
     */
    public function update(Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->key = Str::random(40);
        $project->save();

        return response()->json([
            'key' => $project->key,
        ]);
    }
}
