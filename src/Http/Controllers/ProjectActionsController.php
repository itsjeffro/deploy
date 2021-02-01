<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Deploy\Models\Action;
use Illuminate\Http\JsonResponse;

class ProjectActionsController extends Controller
{
    /**
     * @var \Deploy\Models\Action
     */
    protected $action;

    /**
     * Instantiate ProjectActionsController
     */
    public function __construct(Action $action)
    {
        $this->action = $action;
    }

    /**
     * List actions.
     */
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $actions = $this->action
            ->getHooksByProject($project)
            ->get();

        return response()->json($actions);
    }

    /**
     * List hooks belonging to specified project's actions.
     */
    public function show(Project $project, Action $action): JsonResponse
    {
        $this->authorize('view', $project);

        $action = $action
            ->getHooksByProject($project)
            ->where('id', $action->id)
            ->first();

        return response()->json($action);
    }
}
