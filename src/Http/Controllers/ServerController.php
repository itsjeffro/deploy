<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ServerRequest;
use Deploy\Jobs\CreateServerKeysJob;
use Deploy\Jobs\DeleteServerKeysJob;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Deploy\Resources\ServerResource;
use Deploy\Ssh\Key;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;
use Exception;

class ServerController extends Controller
{
    /** @var \Deploy\Ssh\Key */
    private $sshKey;

    /**
     * ServerController constructor.
     */
    public function __construct(Key $sshKey)
    {
        $this->sshKey = $sshKey;
    }

    /**
     * Get servers.
     */
    public function index()
    {
        $user = auth()->id();

        $servers = Server::with([
                'projects' => function ($query) {
                    $query->select('projects.id', 'name');
                }
            ])
            ->where('user_id', $user)
            ->paginate();

        return ServerResource::collection($servers);
    }

    /**
     * Return specified server.
     */
    public function show(Server $server)
    {
        $this->authorize('view', $server);

        return new ServerResource($server);
    }

    /**
     * Create server.
     *
     * @throws Exception
     */
    public function store(ServerRequest $request): JsonResponse
    {
        $this->authorize('create', Server::class);

        DB::beginTransaction();

        try {
            $userId = auth()->id();

            $server = new Server();
            $server->fill([
                'user_id' => $userId,
                'name' => $request->get('name'),
                'ip_address' => $request->get('ip_address'),
                'port' => $request->get('port'),
                'connect_as' => $request->get('connect_as'),
                'project_path' => $request->get('project_path'),
            ]);
            $server->save();

            $server = $this->createKeys($server);

            if ($request->has('project_id')) {
                $projectServer = new ProjectServer();
                $projectServer->project_id = $request->input('project_id');
                $projectServer->server_id = $server->id;
                $projectServer->save();
            }

            DB::commit();
        } catch (Exception $exception) {
            DB::rollBack();

            throw $exception;
        }

        return response()->json($server, 201);
    }

    /**
     * Update specified server.
     */
    public function update(Server $server, ServerRequest $request): JsonResponse
    {
        $this->authorize('update', $server);

        $server->fill($request->all());
        $server->save();

        return response()->json($server);
    }

    /**
     * Delete specified server.
     */
    public function destroy(Server $server): JsonResponse
    {
        $this->authorize('delete', $server);

        $projects = ProjectServer::where('server_id', $server->id)->count();

        if ($projects > 0) {
            return response()->json([
                'errors' => [
                    'projects' => [
                        'Remove server from projects before deleting.'
                    ],
                ],
            ], 422);
        }

        $server->delete();

        dispatch(new DeleteServerKeysJob($server));

        return response()->json(null, 204);
    }

    /**
     * Create server private and public key.
     */
    protected function createKeys(Server $server): Server
    {
        $sshKeys = $this->sshKey
            ->generate('id_rsa', config('deploy.ssh_key.comment'));

        // Store public key contents.
        $server->public_key = $sshKeys['publickey'];
        $server->save();

        // Queue job to create the private key associated with the stored public key.
        dispatch(new CreateServerKeysJob($server, $sshKeys));

        return $server;
    }
}
