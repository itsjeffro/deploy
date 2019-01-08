<?php

namespace Deploy\Deployment;

class HookActions
{
    /**
     * @var int
     */
    const ACTION_CLONE_RELEASE_ID = 1;

    /**
     * @var int
     */
    const ACTION_ACTIVATE_RELEASE_ID = 2;

    /**
     * @var int
     */
    const ACTION_CLEAN_UP_ID = 3;

    /**
     * @var string
     */
    const ACTION_CLONE_RELEASE_NAME = 'Clone New Release';

    /**
     * @var string
     */
    const ACTION_ACTIVATE_RELEASE_NAME = 'Activate New Release';

    /**
     * @var string
     */
    const ACTION_CLEAN_UP_NAME = 'Clean Up';

    /**
     * @var array
     */
    public $servers;

    /**
     * Return main deployment hook actions.
     *
     * @return array
     */
    public function getActions()
    {
        return [
            [
                'id'             => self::ACTION_CLONE_RELEASE_ID,
                'name'           => self::ACTION_CLONE_RELEASE_NAME,
                'servers'        => $this->getServers(),
                'deploy_hook_id' => null,
            ],
            [
                'id'             => self::ACTION_ACTIVATE_RELEASE_ID,
                'name'           => self::ACTION_ACTIVATE_RELEASE_NAME,
                'servers'        => $this->getServers(),
                'deploy_hook_id' => null,
            ],
            [
                'id'             => self::ACTION_CLEAN_UP_ID,
                'name'           => self::ACTION_CLEAN_UP_NAME,
                'servers'        => $this->getServers(),
                'deploy_hook_id' => null,
            ],
        ];
    }

    /**
     * Set servers.
     *
     * @return self
     */
    public function setServers($servers)
    {
        $this->servers = $servers;

        return $this;
    }

    /**
     * Get servers.
     *
     * @return array
     */
    public function getServers()
    {
        return $this->servers;
    }
}
