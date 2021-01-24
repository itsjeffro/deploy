<?php

namespace Deploy\Ssh;

use Symfony\Component\Process\Process;

class Client
{
    /** @var \Deploy\Ssh\Host */
    public $host;
    
    /** @var string */
    public $script;

    /**
     * The time seconds that the client should attempt to connect before timing out.
     *
     * @var integer
     */
    public $timeout = 300;
    
    /**
     * Client construct.
     */
    public function __construct(Host $host, string $script = '')
    {
        $this->host = $host;
        $this->script = $script;
    }
    
    /**
     * Get host instance.
     */
    public function getHost(): Host
    {
        return $this->host;
    }
    
    /**
     * Get script for processor to run.
     */
    public function getScript(): string
    {
        return $this->script;
    }

    /**
     * Start a SSH process.
     */
    public function getProcess(): Process
    {
        $host = $this->getHost();
        $command = $this->getScript();
        $sshArguments = $this->initializeMultiplexing($host);

        if ($command) {
            $delimiter = 'EOF';
            $command = "'bash -se' << \\$delimiter".PHP_EOL
                .$command.PHP_EOL
                .$delimiter;
        }

        $ssh = "ssh $sshArguments $host $command";

        $process = Process::fromShellCommandline($ssh);

        return $process->setTimeout($this->timeout);
    }

    /**
     * Sets the time in seconds for timeout.
     */
    public function setTimeout(int $seconds): self
    {
        $this->timeout = $seconds;

        return $this;
    }
    
    /**
     * Initialize multiplexing.
     */
    public function initializeMultiplexing(Host $host): string
    {
        if (!$this->isMultiplexingEnabled()) {
            return $host->getSshArguments();
        }

        $sshArguments = $host
                ->withMultiplexing()
                ->getSshArguments();

        if (!$this->isMultiplexingInitialized($host, $sshArguments)) {
            $masterProcess = Process::fromShellCommandline("ssh -N $sshArguments $host");
            $masterProcess
                ->disableOutput()
                ->run();
        }

        return $sshArguments;
    }
    
    /**
     * Check of there is an open master connection being persisted.
     */
    public function isMultiplexingInitialized(Host $host, string $sshArguments): bool
    {
        $checkMasterProcess = Process::fromShellCommandline("ssh -O check $sshArguments $host 2>&1");
        $checkMasterProcess->run();

        return (bool) preg_match('/Master running/', $checkMasterProcess->getOutput());
    }
    
    /**
     * Get value for ssh_multiplexing from the deploy config.
     */
    public function isMultiplexingEnabled(): bool
    {
        return config('deploy.ssh_multiplexing', false);
    }
}
