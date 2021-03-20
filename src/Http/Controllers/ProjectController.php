<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ProjectRequest;
use Deploy\Http\Requests\ProjectGeneralRequest;
use Deploy\Models\Project;
use Deploy\Models\Deployment;
use Deploy\Models\ProjectServer;
use Deploy\Models\Environment;
use Deploy\Models\Hook;
use Deploy\Models\Process;
use Deploy\Resources\ProjectResource;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * List projects.
     */
    public function index()
    {
        $projects = Project::withCount([
                'deployments as daily_deployments_count' => function ($query) {
                    $query->byToday(1);
                },
                'deployments as weekly_deployments_count' => function ($query) {
                    $query->byDaysAgo(7);
                }
            ])
            ->where('user_id', auth()->id())
            ->get();

        return ProjectResource::collection($projects);
    }

    /**
     * Create project.
     */
    public function store(ProjectRequest $request): JsonResponse
    {
        $project = new Project();
        $project->fill([
            'key'=> Str::random(40),
            'user_id' => auth()->id(),
            'name'=> $request->get('name'),
            'provider_id' => $request->get('provider_id'),
            'repository' => $request->get('repository'),
            'branch' => Project::MASTER_BRANCH,
        ]);
        $project->save();

        $project = Project::find($project->id);

        return response()->json($project, 201);
    }

    /**
     * Display project details and server setup.
     *
     * @throws AuthorizationException
     */
    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $project = $project::withCount([
                'deployments as daily_deployments_count' => function ($query) {
                    $query->byToday(1);
                },
                'deployments as weekly_deployments_count' => function ($query) {
                    $query->byDaysAgo(7);
                }
            ])
            ->find($project->id);

        return response()->json(new ProjectResource($project));
    }

    /**
     * Update project.
     *
     * @throws AuthorizationException
     */
    public function update(ProjectGeneralRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->fill($request->all());
        $project->save();

        return response()->json($project);
    }

    /**
     * Delete project.
     *
     * @throws AuthorizationException
     */
    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        // Remove env associated with project
        Environment::where('project_id', $project->id)->delete();

        // Remove deployment related data associated with project
        Process::where('project_id', $project->id)->delete();
        Hook::where('project_id', $project->id)->delete();
        Deployment::where('project_id', $project->id)->delete();

        // Remove servers from project. Notes: Servers will not be deleted.
        ProjectServer::where('project_id', $project->id)->delete();

        $project->delete();

        return response()->json(null, 204);
    }
}
