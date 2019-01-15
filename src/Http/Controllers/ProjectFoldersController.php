<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\FolderRequest;
use Deploy\Models\Folder;
use Deploy\Models\Project;

class ProjectFoldersController extends Controller
{
    /**
     * List folders from project.
     *
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Project $project)
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
     *
     * @param  \Deploy\Http\Requests\FolderRequest $request
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(FolderRequest $request, Project $project)
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
     *
     * @param  \Deploy\Models\Project $project
     * @param  \Deploy\Models\Folder $folder
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project, Folder $folder)
    {
        if ($project->id !== $folder->project_id) {
            abort(404, 'Not found.');
        }

        $this->authorize('delete', $folder);

        $folder->delete();

        return response()->json(null, 204);
    }
}
