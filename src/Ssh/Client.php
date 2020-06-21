<?php

namespace Deploy\Ssh;

use Symfony\Component\Process\Process;

class Client
{
    /**
     * @var \Deploy\Ssh\Host
     */
    public $host;
    
    /**
     * @var string
     */
    public $script;

    /**
     * The time seconds that the client should attempt to connect before timing out.
     *
     * @var integer
     */
    public $timeout = 300;
    
    /**
     * Instantiate.
     *
     * @param \use Deploy\Ssh\Host $host
     * @param string $script
     */
    public function __construct(Host $host, $script = '')
    {
        $this->host = $host;
        $this->script = $script;
    }
    
    /**
     * Get host instance.
     *
     * @return \Deploy\Ssh\Host
     */
    public function getHost()
    {
        return $this->host;
    }
    
    /**
     * Get script for processor to run.
     *
     * @return string
     */
    public function getScript()
    {
        return $this->script;
    }

    /**
     * Start a SSH process.
     *
     * @return Process
     */
    public function getProcess()
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

        $process = new Process($ssh);

        return $process->setTimeout($this->timeout);
    }

    /**
     * Sets the time in seconds for timeout.
     *
     * @param  integer $seconds
     * @return self
     */
    public function setTimeout($seconds)
    {
        $this->timeout = $seconds;

        return $this;
    }
    
    /**
     * Initialize multiplexing.
     *
     * @param  Host $host
     * @return string
     */
    public function initializeMultiplexing(Host $host)
    {
        if (!$this->isMultiplexingEnabled()) {
            return $host->getSshArguments();
        }

        $sshArguments = $host
                ->withMultiplexing()
                ->getSshArguments();

        if (!$this->isMultiplexingInitialized($host, $sshArguments)) {
            $masterProcess = new Process("ssh -N $sshArguments $host");
            $masterProcess
                ->disableOutput()
                ->run();
        }

        return $sshArguments;
    }
    
    /**
     * Check of there is an open master connection being persisted.
     *
     * @param  Host $host
     * @param  string $sshArguments
     * @return bool
     */
    public function isMultiplexingInitialized(Host $host, $sshArguments)
    {
        $checkMasterProcess = new Process("ssh -O check $sshArguments $host 2>&1");
        $checkMasterProcess->run();

        $isMasterRunning = (bool) preg_match('/Master running/', $checkMasterProcess->getOutput()) ? true : false;

        return $isMasterRunning;
    }
    
    /**
     * Get value for ssh_multiplexing from the deploy config.
     *
     * @return bool
     */
    public function isMultiplexingEnabled()
    {
        return config('deploy.ssh_multiplexing');
    }
}
