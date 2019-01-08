<?php

namespace Deploy\Ssh;

class Host
{
    /**
     * @var string
     */
    private $user;

    /**
     * @var string
     */
    private $host;

    /**
     * @var string
     */
    private $port;

    /**
     * @var array
     */
    private $arguments = [];

    /**
     * @param string $host
     */
    public function __construct($host)
    {
        $this->host = $host;
    }

    /**
     * Returns the combined user/host if the Host object is used as a string.
     *
     * @return string
     */
    public function __toString()
    {
        $user = empty($this->user) ? '' : $this->user.'@';

        return $user.$this->host;
    }

    /**
     * Set user.
     *
     * @param string $user
     *
     * @return self
     */
    public function user($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Set port.
     *
     * @param string $port
     *
     * @return self
     */
    public function port($port)
    {
        $this->port = $port;

        $this->setFlag('-p', $port);

        return $this;
    }

    /**
     * The path of the identify file on the server performing the ssh.
     *
     * @param string $identityFile
     *
     * @return self
     */
    public function identityFile($identityFile)
    {
        $this->setFlag('-i', $identityFile);

        return $this;
    }

    /**
     * Return ssh arguments.
     *
     * @return string
     */
    public function getSshArguments()
    {
        return implode(' ', $this->arguments);
    }

    /**
     * Add ssh option.
     *
     * @param string $option
     * @param string $value
     *
     * @return self
     */
    public function addSshOption($option, $value)
    {
        $this->setFlag('-o', $option.'='.$value);

        return $this;
    }

    /**
     * Set flag and ssh option.
     *
     * @param string $flag
     * @param string $value
     */
    public function setFlag($flag, $value)
    {
        array_push($this->arguments, $flag.' '.$value);
    }

    /**
     * Return options for multiplexing.
     *
     * @return self
     */
    public function withMultiplexing()
    {
        $user = $this->user ? $this->user.'@' : '';
        $port = $this->port ? ':'.$this->port : '';
        $userHost = $user.$this->host.$port;

        return $this
            ->addSshOption('ControlMaster', 'auto')
            ->addSshOption('ControlPersist', '2m')
            ->addSshOption('ControlPath', '~/.ssh/sockets/'.$userHost);
    }
}
