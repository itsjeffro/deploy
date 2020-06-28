<?php

namespace Deploy\Tests\Unit\ProviderRepository;

use Deploy\Ssh\Host;
use Deploy\Ssh\Client;
use Orchestra\Testbench\TestCase;
use Symfony\Component\Process\Process;

class ClientTest extends TestCase
{
    public function test_client_instances()
    {
        $host = new Host('localhost');
        $client = new Client($host);

        $this->assertInstanceOf(Host::class, $client->getHost());
        $this->assertInstanceOf(Process::class, $client->getProcess());
    }
}
