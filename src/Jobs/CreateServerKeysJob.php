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
     * @var \Deploy\Ssh\Key
     */
    private $sshKey;

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
     * @param  \Deploy\Ssh\Key $server
     * @return void
     */
    public function handle(Key $sshKey)
    {
        $this->sshKey = $sshKey;

        $this->createKeys($this->server);
    }

    /**
     * Create server private and public key.
     *
     * @param  \Deploy\Models\Server $server
     * @return void
     */
    protected function createKeys(Server $server)
    {
        $keyPath = storage_path('app/keys/' . $server->id);

        if (!is_dir($keyPath)) {
            mkdir($keyPath);

            $this->sshKey->generate($keyPath, 'id_rsa', 'deploy@itsjeffro.com');
            
            // Store public key contents and keep a file backup
            $server->public_key = file_get_contents($keyPath . '/id_rsa.pub');
            $server->save();

            // Give the keys the correct permissions, otherwise
            // we wont be able to use them for SSH access.
            chmod($keyPath . '/id_rsa', 0600);
            chmod($keyPath . '/id_rsa.pub', 0644);
        }
    }
}