<?php

namespace Deploy\Http\Controllers;

use Deploy\Http\Requests\ServerRequest;
use Deploy\Jobs\CreateServerKeysJob;
use Deploy\Jobs\DeleteServerKeysJob;
use Deploy\Models\ProjectServer;
use Deploy\Models\Server;
use Deploy\Ssh\Key;
use Illuminate\Http\JsonResponse;

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
    public function index(): JsonResponse
    {
        $user = auth()->id();

        $servers = Server::with(['projects'])
            ->where('user_id', $user)
            ->paginate();

        return response()->json($servers);
    }

    /**
     * Return specified server.
     */
    public function show(Server $server): JsonResponse
    {
        $this->authorize('view', $server);

        $server = $server->load(['projects']);

        return response()->json($server);
    }

    /**
     * Create server.
     */
    public function store(ServerRequest $request): JsonResponse
    {
        $userId = auth()->id();

        $server = new Server();
        $server->fill([
            'user_id'      => $userId,
            'name'         => $request->get('name'),
            'ip_address'   => $request->get('ip_address'),
            'port'         => $request->get('port'),
            'connect_as'   => $request->get('connect_as'),
            'project_path' => $request->get('project_path'),
        ]);
        $server->save();

        $server = $this->createKeys($server);

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