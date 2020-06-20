<?php

namespace Deploy;

use Illuminate\Config\Repository as Config;

class DeployMessages
{
    /** @var Config */
    private $config;

    /**
     * @param Config $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * Returns a list of warning messages. Typically these are messages which don't 
     * block usability, but decrease the user-friendliness of the application.
     *
     * @return array
     */
    public function getWarnings(): array
    {
        $isBroadcastingEnabled = $this->config->get('broadcasting.default') !== 'log';
        $broadcastingKey = $this->config->get('broadcasting.connections.pusher.key');

        $alerts = [];

        if (!$isBroadcastingEnabled) {
            $alerts[] = [
                'code' => 'BROADCASTER_DRIVER',
                'message' => 'Set BROADCAST_DRIVER to "pusher" for real-time feedback'
            ];
        }
      
        if ($isBroadcastingEnabled && empty($broadcastingKey)) {
            $alerts[] = [
                'code' => 'BROADCASTER_CREDS',
                'message' => 'Ensure your Pusher credentials are properly set up'
            ];
        }

        return $alerts;
    }
}
