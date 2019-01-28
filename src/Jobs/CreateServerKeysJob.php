<?php

namespace Deploy\Jobs;

use Deploy\Models\Server;
use Deploy\Ssh\Key;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class CreateServerKeysJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var \Deploy\Models\Server
     */
    private $server;
    
    /**
     * @var array
     */
    private $sshKeys;

    /**
     * Create a new job instance.
     *
     * @param \Deploy\Models\Server $server
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
     * @param  \Deploy\Ssh\Key $server
     * @return void
     */
    public function handle()
    {
        $this->createKeys($this->server, $this->sshKeys);
    }

    /**
     * Create server private and public key.
     *
     * @param \Deploy\Models\Server $server
     * @param array $sshKeys
     * @return void
     */
    protected function createKeys(Server $server, array $sshKeys)
    {
        $sshKeyPath = rtrim(config('deploy.ssh_key.path'), '/') . '/';
        
        if (!is_dir($sshKeyPath)) {
            mkdir($sshKeyPath);
        }
        
        // Create the associated private key for the public key we created with our new server.
        file_put_contents($sshKeyPath . $server->id, $sshKeys['privatekey']);


        // Give the keys the correct permissions, otherwise
        // we wont be able to use them for SSH access.
        chmod($sshKeyPath . $server->id, Key::PRIVATE_KEY_CHMOD);
    }
}
