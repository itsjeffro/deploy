<?php

namespace Deploy\Listeners;

use Deploy\Events\EnvironmentSyncing;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

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
     * @param  EnvironmentSyncing  $event
     * @return void
     */
    public function handle(EnvironmentSyncing $event)
    {
        //
    }
}
