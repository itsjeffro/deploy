<?php

namespace Deploy\Processors;

use Deploy\Contracts\Processors\ProcessorInterface;
use Deploy\Ssh\Host;
use Deploy\Models\Server;
use Exception;
use Illuminate\Support\Facades\Log;

abstract class AbstractProcessor implements ProcessorInterface
{
    /**
     * Return SSH Host.
     *
     * @param Server $server
     * @return Host
     */
    protected function getHost(Server $server)
    {
        $host = new Host($server->ip_address);
        $keyPath = $this->getKeyPath($server->id);
        
        // In order to use the private key to ssh into a desired destination
        // we must set the correct permissions required for a private key.
        try {
            chmod($keyPath, 0600);
        } catch (Exception $e) {
            $message = 'There was an issue running chmod on file path [%s] with error - %s';

            throw new Exception(sprintf($message, $keyPath, $e->getMessage()));
        }
        
        return $host->user($server->connect_as)
            ->port($server->port)
            ->identityFile($keyPath)
            ->addSshOption('StrictHostKeyChecking', 'no');
    }
    
    /**
     * Return absolute path to ssh key.
     *
     * @param int $serverId
     * @return string
     */
    protected function getKeyPath($serverId): string
    {
        $keysPath = ltrim(rtrim(config('deploy.ssh_key.path'), '/'), '/');

        return storage_path(sprintf('app/%s/%s', $keysPath, $serverId));
    }
    
    /**
     * Contains logic to run processors.
     *
     * @return void
     */
    abstract public function fire();
}
