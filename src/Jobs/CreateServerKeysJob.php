<?php

namespace Deploy\Jobs;

use Deploy\Events\ProcessorErrorEvent;
use Deploy\Models\Server;
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

    /** @var Server */
    private $server;
    
    /** @var array */
    private $sshKeys;

    /**
     * Create a new job instance.
     *
     * @param Server $server
     * @param array $sshKeys
     * @return void
     */
    public function __construct(Server $server, array $sshKeys)
    {
        $this->server = $server;
        $this->sshKeys = $sshKeys;
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
            
            Storage::makeDirectory($keysDirectory);

            $filePath = sprintf('%s/%s', $keysDirectory, $this->server->id);

            Storage::put($filePath, $this->sshKeys['privatekey']);

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
