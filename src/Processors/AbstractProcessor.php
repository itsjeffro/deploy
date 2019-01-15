<?php

namespace Deploy\Processors;

use Deploy\Ssh\Host;
use Deploy\Models\Server;

abstract class AbstractProcessor
{
    /**
     * Return SSH Host.
     *
     * @param  \Deploy\Models\Server $server
     * @return \Deploy\Ssh\Host
     */
    protected function getHost(Server $server)
    {
        $host = new Host($server->ip_address);
        $keyPath = $this->getKeyPath($server->id);
        
        // In order to use the private key to ssh into a desired destination
        // we must set the correct permissions required for a private key.
        chmod($keyPath, 0600);
        
        return $host->user($server->connect_as)
            ->port($server->port)
            ->identityFile($keyPath)
            ->addSshOption('StrictHostKeyChecking', 'no');
    }
    
    /**
     * Return absolute path to ssh key.
     *
     * @param  int $serverId
     * @return string
     */
    protected function getKeyPath($serverId)
    {
        return storage_path('app/keys/' . $serverId . '/id_rsa');
    }
    
    /**
     * Contains logic to run processors.
     *
     * @return void
     */
    abstract public function fire();
}