<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Project;
use Deploy\Models\Action;

class ProjectActionsController extends Controller
{
    /**
     * @var \Deploy\Models\Action
     */
    protected $action;

    /**
     * Instantiate ProjectActionsController
     *
     * @param \Deploy\Models\Action $action
     */
    public function __construct(Action $action)
    {
        $this->action = $action;
    }

    /**
     * List actions.
     *
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Project $project)
    {
        $this->authorize('view', $project);

        $actions = $this->action
            ->getHooksByProject($project)
            ->get();

        return response()->json($actions);
    }

    /**
     * List hooks belonging to specified project's actions.
     *
     * @param  \Deploy\Models\Project $project
     * @param  \Deploy\Models\Action $action
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Project $project, Action $action)
    {
        $this->authorize('view', $project);

        $action = $action
            ->getHooksByProject($project)
            ->where('id', $action->id)
            ->first();

        return response()->json($action);
    }
}