<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\EnvironmentRequest;
use Deploy\Jobs\WriteEnvironmentJob;
use Deploy\Models\Project;
use Deploy\Models\Environment;
use Deploy\Environment\EnvironmentEncrypter;
use Deploy\Models\Server;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Crypt;

class ProjectEnvironmentController extends Controller
{
    /** @var EnvironmentEncrypter */
    private $environmentEncrypter;

    /**
     * ProjectEnvironmentController constructor.
     */
    public function __construct(EnvironmentEncrypter $environmentEncrypter)
    {
        $this->environmentEncrypter = $environmentEncrypter;
    }

    /**
     * Update environment.
     */
    public function update(EnvironmentRequest $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $environment = Environment::where('project_id', $project->id)->first();

        $encrypter = $this->environmentEncrypter
            ->setKey($request->get('key'));

        if (!$environment) {
            return response()->json(
                sprintf('Environment does not exist for project with id %i', $project->id),
                404
            );
        }

        $environment->contents = $encrypter->encrypt($request->get('contents'));
        $environment->save();

        // @TODO Move server check to request
        $servers = Server::where('user_id', $project->user_id)
            ->whereIn('id', $request->get('servers'))
            ->get()
            ->pluck('id')
            ->toArray();

        if (empty($servers)) {
            return response()->json([
                'errors' => [
                    'servers' => [
                        'No servers were provided',
                    ]
                ]
            ], 422);
        }

        $environment->environmentServers()->sync($servers);

        // Encrypt the user's environment key before dispatching the queue event not passed
        // in the jobs's payload in plaintext. We will decrypt when the job is processed.
        $encryptedKey = Crypt::encryptString($request->get('key'));

        dispatch(new WriteEnvironmentJob($project, $environment, $encryptedKey));

        return response()->json(null, 204);
    }
}
