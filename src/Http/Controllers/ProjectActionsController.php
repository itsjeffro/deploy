<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\HookOrderRequest;
use Deploy\Models\Hook;
use Deploy\Models\Project;
use Deploy\Models\Action;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProjectActionsController extends Controller
{
    /**
     * @var Action
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
     *
     * @throws AuthorizationException
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
     *
     * @throws AuthorizationException
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

    /**
     * Bulk update the order of the hooks.
     *
     * @throws AuthorizationException
     * @throws \Throwable
     */
    public function updateHookOrder(HookOrderRequest $request, Project $project, Action $action): JsonResponse
    {
        $this->authorize('view', $project);

        $hookOrders = collect($request->input('hooks', []));

        // Ensure we only return hooks belonging to this user's project.
        $projectHooks = Hook::where('project_id', $project->id)
            ->where('action_id', $action->id)
            ->whereIn('id', $hookOrders->pluck('id'))
            ->get();

        // Loop through the queried project hooks. Using the mapped position,
        // order values from the request payload, update the project hooks.
        DB::beginTransaction();

        try {
            foreach ($projectHooks as $projectHook) {
                $hookOrder = Arr::first($hookOrders, function ($value) use ($projectHook) {
                    return $value['id'] === $projectHook->id;
                });

                if ($hookOrder) {
                    $projectHook->update([
                        'position' => Arr::get($hookOrder, 'position'),
                        'order' => Arr::get($hookOrder, 'order'),
                    ]);
                }
            }

            DB::commit();

            return response()->json(null, 204);
        } catch (\Throwable $throwable) {
            DB::rollBack();

            throw $throwable;
        }
    }
}
