<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\HookRequest;
use Deploy\Models\Action;
use Deploy\Models\Hook;
use Deploy\Models\Project;

class ProjectActionHooksController extends Controller
{
    /**
     * Show deployment hook.
     *
     * @param \Deploy\Models\Project $project
     * @param \Deploy\Models\Action  $action
     * @param \Deploy\Models\Hook    $hook
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Project $project, Action $action, Hook $hook)
    {
        if ($hook->action_id !== $action->id || $hook->project_id !== $project->id) {
            return response()->json('Not found.', 404);
        }

        $this->authorize('view', $hook);

        return response()->json($hook);
    }

    /**
     * Add hook to action.
     *
     * @param \Deploy\Http\Requests\HookRequest $request
     * @param \Deploy\Models\Project            $project
     * @param \Deploy\Models\Action             $action
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(HookRequest $request, Project $project, Action $action)
    {
        if ($project->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $hook = new Hook();
        $hook->fill($request->all());
        $hook->save();

        return response()->json($hook, 201);
    }

    /**
     * Update deployment hook.
     *
     * @param \Deploy\Http\Requests\HookRequest $request
     * @param \Deploy\Models\Project            $project
     * @param \Deploy\Models\Action             $action
     * @param \Deploy\Models\Hook               $hook
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(HookRequest $request, Project $project, Action $action, Hook $hook)
    {
        $this->authorize('update', $hook);

        $hook->name = $request->input('name');
        $hook->script = $request->input('script');
        $hook->save();

        return response()->json($hook);
    }

    /**
     * Delete deployment hook.
     *
     * @param \Deploy\Models\Project $project
     * @param \Deploy\Models\Action  $action
     * @param \Deploy\Models\Hook    $hook
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project, Action $action, Hook $hook)
    {
        $this->authorize('delete', $hook);

        $hook->delete();

        return response()->json(null, 204);
    }
}
