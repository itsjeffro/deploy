<?php

namespace Deploy\Listeners;

use Deploy\Events\DeploymentFinished;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendDeploymentFinishedNotification
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
     * @param  DeploymentFinished  $event
     * @return void
     */
    public function handle(DeploymentFinished $event)
    {
        return $event;
    }
}
