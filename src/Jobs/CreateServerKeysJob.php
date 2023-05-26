<?php

namespace Deploy\Jobs;

use Deploy\Events\ProcessorErrorEvent;
use Deploy\Models\Server;
use Deploy\Ssh\Key;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Storage;

class CreateServerKeysJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private Server $server, private Key $rsa)
    {}

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $keysDirectory = rtrim(config('deploy.ssh_key.path'), '/');
            
            Storage::makeDirectory($keysDirectory);

            $filePath = sprintf('%s/%s', $keysDirectory, $this->server->id);

            Storage::put($filePath, $this->rsa->getPrivateKey());

            $fileExists = Storage::exists($filePath);

            if (!$fileExists) {
                throw new Exception(sprintf('Could not confirm server private key was created in path [%s]', $filePath));
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
