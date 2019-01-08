<?php

namespace Deploy\Jobs;

use Deploy\Models\Server;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
     * @param \Deploy\Models\Server $server
     *
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
     * @param \Deploy\Models\Server $server
     *
     * @return void
     */
    protected function deleteKeys(Server $server)
    {
        $keyPath = 'keys/'.$server->id;

        if (is_dir(storage_path('app/'.$keyPath))) {
            Storage::deleteDirectory($keyPath);

            Log::info('Removed directory '.storage_path('app/'.$keyPath));
        } else {
            Log::info('Could not find directory '.storage_path('app/'.$keyPath));
        }
    }
}
