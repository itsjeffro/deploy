<?php

namespace Deploy\Listeners;

use Deploy\Events\EnvironmentSyncing;

class EnvironmentSyncingNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param EnvironmentSyncing $event
     *
     * @return void
     */
    public function handle(EnvironmentSyncing $event)
    {
        //
    }
}
