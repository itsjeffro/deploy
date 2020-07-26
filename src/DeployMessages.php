<?php

namespace Deploy;

use Illuminate\Contracts\Config\Repository;

class DeployMessages
{
    /** @var Repository */
    private $config;

    /** @var string */
    const BROADCASTER_DRIVER = 'BROADCASTER_DRIVER';

    /** @var string */
    const BROADCASTER_CREDENTIALS = 'BROADCASTER_CREDENTIALS';

    /** @var string */
    const QUEUE_CONNECTION = 'QUEUE_CONNECTION';

    /**
     * @param Repository $config
     */
    public function __construct(Repository $config)
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
        $isBroadcastingEnabled = $this->config->get('broadcasting.default') === 'pusher';
        $broadcastingKey = $this->config->get('broadcasting.connections.pusher.key');
        $isQueueEnabled = strtolower($this->config->get('queue.default')) !== 'sync';

        $alerts = [];

        if (!$isBroadcastingEnabled) {
            $alerts[] = [
                'code' => self::BROADCASTER_DRIVER,
                'message' => 'Set BROADCAST_DRIVER to "pusher" for real-time feedback'
            ];
        }
      
        if ($isBroadcastingEnabled && empty($broadcastingKey)) {
            $alerts[] = [
                'code' => self::BROADCASTER_CREDENTIALS,
                'message' => 'Ensure your Pusher credentials are properly set up'
            ];
        }

        if (!$isQueueEnabled) {
            $alerts[] = [
                'code' => self::QUEUE_CONNECTION,
                'message' => 'Set QUEUE_CONNECTION to another value other than "sync"'
            ];
        }

        return $alerts;
    }
}
