<?php

namespace Deploy\Jobs;

use Deploy\Events\ProcessorErrorEvent;
use Deploy\Models\Server;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
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

    /** @var Server */
    private $server;

    /**
     * Create a new job instance.
     *
     * @param Server $server
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
        try {
            $keysDirectory = rtrim(config('deploy.ssh_key.path'), '/');

            $filePath = sprintf('%s/%s', $keysDirectory, $this->server->id);

            $fileExists = Storage::exists($filePath);

            if (!$fileExists) {
                throw new Exception(sprintf('Server private key does not exist in path [%s]', $filePath));
            }

            if (!Storage::delete($filePath)) {
                throw new Exception(sprintf('Server private key could not be deleted from path [%s]', $filePath));
            }
        } catch (Exception $exception) {
            event(new ProcessorErrorEvent(
                'Server private key issue',
                $this->server->project_id,
                $this->server,
                $exception
            ));
        }
    }
}
