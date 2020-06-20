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
        \Deploy\Events\ServerConnectionTested::class => [
            \Deploy\Listeners\SendSeverConnectionNotification::class,
        ],
        \Deploy\Events\DeploymentFinished::class => [
            \Deploy\Listeners\SendDeploymentFinishedNotification::class,
        ],
        \Deploy\Events\EnvironmentSyncing::class => [
            \Deploy\Listeners\EnvironmentSyncingNotification::class,
        ],
        \Deploy\Events\EnvironmentSynced::class => [
            \Deploy\Listeners\EnvironmentSyncedNotification::class,
        ],
        \Deploy\Events\ProcessorErrorEvent::class => [
            \Deploy\Listeners\ProcessorErrorListener::class,
        ],
    ];
}
