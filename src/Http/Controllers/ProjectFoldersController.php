<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\FolderRequest;
use Deploy\Models\Folder;
use Deploy\Models\Project;
use Illuminate\Http\JsonResponse;

class ProjectFoldersController extends Controller
{
    /**
     * List folders from project.
     */
    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $folders = Folder::where('project_id', $project->id)
            ->with(['project'])
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($folders);
    }

    /**
     * Store folder link.
     */
    public function store(FolderRequest $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $folder = new Folder;
        $folder->project_id = $project->id;
        $folder->from = $request->get('from');
        $folder->to = $request->get('to');
        $folder->save();

        return response()->json($folder, 201);
    }

    /**
     * Delete folder link.
     */
    public function destroy(Project $project, Folder $folder): JsonResponse
    {
        if ($project->id !== $folder->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('delete', $folder);

        $folder->delete();

        return response()->json(null, 204);
    }
}
