<?php

namespace Deploy\Tests\Unit\ProviderRepository;

use Deploy\Ssh\Host;
use PHPUnit\Framework\TestCase;

class HostTest extends TestCase
{
    public function test_command_hostname()
    {
        $host = new Host('127.0.0.1');

        $this->assertEquals('ssh 127.0.0.1', "ssh $host");
    }

    public function test_command_hostname_with_user()
    {
        $host = new Host('127.0.0.1');
        $host->user('root');

        $this->assertEquals('ssh root@127.0.0.1', "ssh $host");
    }

    public function test_command_hostname_with_arguments()
    {
        $host = new Host('127.0.0.1');

        $host->user('root')
            ->port(22)
            ->identityFile('~/.ssh/id_rsa')
            ->addSshOption('StrictHostKeyChecking', 'no');

        $arguments = $host->getSshArguments();

        $this->assertEquals(
            'ssh -p 22 -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no root@127.0.0.1',
            "ssh $arguments $host"
        );
    }

    public function test_command_initialize_multiplexing()
    {
        $host = new Host('127.0.0.1');

        $host->user('root')
            ->port(22)
            ->identityFile('~/.ssh/id_rsa')
            ->addSshOption('StrictHostKeyChecking', 'no');

        $arguments = $host
            ->withMultiplexing()
            ->getSshArguments();

        $this->assertEquals(
            'ssh -N -p 22 -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPersist=2m -o ControlPath=~/.ssh/sockets/root@127.0.0.1:22 root@127.0.0.1',
            "ssh -N $arguments $host"
        );
    }

    public function test_command_check_multiplexing_initialized()
    {
        $host = new Host('127.0.0.1');

        $host->user('root')
            ->port(22)
            ->identityFile('~/.ssh/id_rsa')
            ->addSshOption('StrictHostKeyChecking', 'no');

        $arguments = $host
            ->withMultiplexing()
            ->getSshArguments();

        $this->assertEquals(
            'ssh -O check -p 22 -i ~/.ssh/id_rsa -o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPersist=2m -o ControlPath=~/.ssh/sockets/root@127.0.0.1:22 root@127.0.0.1',
            "ssh -O check $arguments $host"
        );
    }
}
