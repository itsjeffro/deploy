<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ProjectGeneralRequest;
use Deploy\Http\Requests\ProjectRequest;
use Deploy\Models\Deployment;
use Deploy\Models\Environment;
use Deploy\Models\Project;
use Deploy\Models\Server;

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

        return response()->json($projects);
    }

    /**
     * Create project.
     *
     * @param \Deploy\Http\Requests\ProjectRequest $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ProjectRequest $request)
    {
        $project = new Project();
        $project->fill([
            'key'         => str_random(40),
            'user_id'     => auth()->id(),
            'name'        => $request->get('name'),
            'provider_id' => $request->get('provider_id'),
            'repository'  => $request->get('repository'),
            'branch'      => Project::MASTER_BRANCH,
        ]);
        $project->save();

        $project = Project::find($project->id);

        return response()->json($project, 201);
    }

    /**
     * Display project details and server setup.
     *
     * @param \Deploy\Models\Project $project
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Project $project)
    {
        $this->authorize('view', $project);

        $project = $project->withCount([
                'deployments as daily_deployments' => function ($query) {
                    $query->byToday(1);
                },
                'deployments as weekly_deployments' => function ($query) {
                    $query->byDaysAgo(7);
                },
            ])
            ->find($project->id);

        return response()->json($project);
    }

    /**
     * Update project.
     *
     * @param \Deploy\Http\Requests\ProjectGeneralRequest $request
     * @param \Deploy\Models\Project                      $project
     *
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
     * @param \Deploy\Models\Project $project
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project);

        Server::where('project_id', $project->id)->delete();
        Environment::where('project_id', $project->id)->delete();
        Deployment::where('project_id', $project->id)->delete();

        $project->delete();

        return response()->json(null, 204);
    }
}
