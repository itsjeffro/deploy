<?php

namespace Deploy;

trait EventMap
{
    /**
     * All of the Deploy event / listener mappings.
     *
     * @var array
     */
    protected $events = [
        'Events\ServerConnectionTested' => [
            'Listeners\SendSeverConnectionNotification',
        ],
        'Events\DeploymentFinished' => [
            'Listeners\SendDeploymentFinishedNotification',
        ],
        'Events\EnvironmentSyncing' => [
            'Listeners\EnvironmentSyncingNotification',
        ],
        'Events\EnvironmentSynced' => [
            'Listeners\EnvironmentSyncedNotification',
        ],
    ];
}
