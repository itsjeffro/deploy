<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Events\ProcessorErrorEvent;
use Deploy\Events\ServerConnectionTested;
use Deploy\Models\Server;
use Deploy\Ssh\Client;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Exception\ProcessTimedOutException;

class ServerConnectionProcessor extends AbstractProcessor implements ProcessorInterface
{
    /**
     * @var Server
     */
    public $server;

    /**
     * Set server.
     */
    public function setServer(Server $server): self
    {
        $this->server = $server;

        return $this;
    }

    /**
     * {@inheritDoc}
     */
    public function fire(): void
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
        } catch (ProcessFailedException | ProcessTimedOutException $exception) {
            $message = $exception->getProcess()->getErrorOutput();

            if ($exception instanceof ProcessTimedOutException) {
                $message = 'Process timed out trying to connect to server. Make sure the server details are correct.';
            }

            event(new ProcessorErrorEvent(
                'Server connection test issue',
                $this->server->user_id,
                $this->server,
                $message
            ));
        }
        
        $server = Server::find($this->server->id);
        $server->connection_status = $successful;
        $server->save();
        
        event(new ServerConnectionTested($server));
    }
}
