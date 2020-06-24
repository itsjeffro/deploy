<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ProjectRequest;
use Deploy\Http\Requests\ProjectGeneralRequest;
use Deploy\Models\Project;
use Deploy\Models\Deployment;
use Deploy\Models\Server;
use Deploy\Models\Environment;
use Deploy\Models\Hook;
use Deploy\Models\Notification;
use Deploy\Models\Process;
use Deploy\Resources\ProjectResource;

class ProjectController extends Controller
{
    /**
     * List projects.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $projects = Project::where('user_id', auth()->id())->get();

        return ProjectResource::collection($projects);
    }

    /**
     * Create project.
     *
     * @param  \Deploy\Http\Requests\ProjectRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ProjectRequest $request)
    {
        $project = new Project();
        $project->fill([
            'key'=> str_random(40),
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
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        $this->authorize('view', $project);

        $project = $project->withCount([
                'deployments as daily_deployments_count' => function ($query) {
                    $query->byToday(1);
                },
                'deployments as weekly_deployments_count' => function ($query) {
                    $query->byDaysAgo(7);
                }
            ])
            ->find($project->id);

        return response()->json($project);
    }

    /**
     * Update project.
     *
     * @param  \Deploy\Http\Requests\ProjectGeneralRequest $request
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(ProjectGeneralRequest $request, Project $project)
    {
        $this->authorize('update', $project);

        $project->fill($request->all());
        $project->save();

        return response()->json($project);
    }

    /**
     * Delete project.
     *
     * @param  \Deploy\Models\Project $project
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        // Remove notifications associated with project
        Notification::where('project_id', $project->id)->forceDelete();

        // Remove env associated with project
        Environment::where('project_id', $project->id)->delete();

        // Remove deployment related data associated with project
        Process::where('project_id', $project->id)->delete();
        Hook::where('project_id', $project->id)->delete();
        Deployment::where('project_id', $project->id)->delete();

        // Remove server associated with project
        Server::where('project_id', $project->id)->forceDelete();

        $project->delete();

        return response()->json(null, 204);
    }
}
