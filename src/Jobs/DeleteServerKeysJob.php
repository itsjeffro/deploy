<?php

namespace Deploy\Jobs;

use Deploy\Models\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class DeleteServerKeysJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * @var \Deploy\Models\Server
     */
    private $server;

    /**
     * Create a new job instance.
     *
     * @param  \Deploy\Models\Server $server
     * @return void
     */
    public function __construct(Server $server)
    {
        $this->server = $server;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->deleteKeys($this->server);
    }

    /**
     * Delete server private and public key.
     *
     * @param  \Deploy\Models\Server $server
     * @return void
     */
    protected function deleteKeys(Server $server)
    {
        $sshKeyPath = rtrim(config('deploy.ssh_key.path'), '/') . '/';

        if (file_exists($sshKeyPath . $server->id)) {
            unlink($sshKeyPath . $server->id);
        }
    }
}
