<?php

namespace Deploy\Processors;

use Deploy\Events\ServerConnectionTested;
use Deploy\Models\Server;
use Deploy\Ssh\Client;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ServerConnectionProcessor extends AbstractProcessor
{
    /**
     * @var \Deploy\Models\Server
     */
    public $server;

    /**
     * Instantiate.
     * 
     * @return void
     */
    public function __construct(Server $server)
    {
        $this->server = $server;
    }

    /**
     * {@inheritDoc}
     */
    public function fire()
    {
        $successful = false;
        
        try {
            $client = new Client($this->getHost($this->server));
            $client = $client
                ->setTimeout(30)
                ->getProcess();
            
            $client->run();
            
            if (!$client->isSuccessful()) {
                throw new ProcessFailedException($client);
            }
            
            $successful = true;
        } catch (ProcessFailedException $e) {
            Log::error($e->getMessage());
        } catch (Exception $e) {
            Log::error($e->getMessage());
        }
        
        $server = Server::find($this->server->id);
        $server->connection_status = $successful;
        $server->save();
        
        event(new ServerConnectionTested($server));
    }
}
