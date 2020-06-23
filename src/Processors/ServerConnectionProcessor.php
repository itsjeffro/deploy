<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Events\ProcessorErrorEvent;
use Deploy\Events\ServerConnectionTested;
use Deploy\Models\Server;
use Deploy\Ssh\Client;
use Exception;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Component\Process\Exception\ProcessFailedException;

class ServerConnectionProcessor extends AbstractProcessor implements ProcessorInterface
{
     /** @var dispatcher */
    public $dispatcher;

    /** @var Server */
    public $server;

    /**
     * @param Dispatcher $dispatcher
     */
    public function __construct(Dispatcher $dispatcher)
    {
        $this->dispatcher = $dispatcher;
    }

    /**
     * Set server.
     *
     * @param Server $server
     * @return self
     */
    public function setServer(Server $server)
    {
        $this->server = $server;

        return $this;
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
        } catch (ProcessFailedException | Exception $exception) {
            $this->dispatcher->dispatch(
                new ProcessorErrorEvent('Server connection test issue', $exception, $this->server)
            );
        }
        
        $server = Server::find($this->server->id);
        $server->connection_status = $successful;
        $server->save();
        
        $this->dispatcher->dispatch(new ServerConnectionTested($server));
    }
}
