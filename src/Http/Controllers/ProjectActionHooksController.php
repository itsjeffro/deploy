<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Action;
use Deploy\Models\Hook;
use Deploy\Models\Project;
use Deploy\Http\Requests\HookRequest;
use Illuminate\Http\JsonResponse;

class ProjectActionHooksController extends Controller
{
    /**
     * Show deployment hook.
     */
    public function show(Project $project, Action $action, Hook $hook): JsonResponse
    {
        if ($hook->action_id !== $action->id || $hook->project_id !== $project->id) {
            return response()->json('Not found.', 404);
        }

        $this->authorize('view', $hook);

        return response()->json($hook);
    }

    /**
     * Add hook to action.
     */
    public function store(HookRequest $request, Project $project, Action $action): JsonResponse
    {
        if ($project->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $hook = new Hook;
        $hook->fill($request->all());
        $hook->save();

        return response()->json($hook, 201);
    }

    /**
     * Update deployment hook.
     */
    public function update(HookRequest $request, Project $project, Action $action, Hook $hook): JsonResponse
    {
        $this->authorize('update', $hook);

        $hook->name = $request->input('name');
        $hook->script = $request->input('script');
        $hook->save();

        return response()->json($hook);
    }

    /**
     * Delete deployment hook.
     */
    public function destroy(Project $project, Action $action, Hook $hook): JsonResponse
    {
        $this->authorize('delete', $hook);

        $hook->delete();

        return response()->json(null, 204);
    }
}
