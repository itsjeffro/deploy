<?php

namespace Deploy\Listeners;

use Deploy\Events\DeploymentFinished;

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
     * @param DeploymentFinished $event
     *
     * @return void
     */
    public function handle(DeploymentFinished $event)
    {
        return $event;
    }
}
