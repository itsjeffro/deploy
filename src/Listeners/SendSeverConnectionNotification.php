<?php

namespace Deploy\Listeners;

use Deploy\Events\ServerConnectionTested;

class SendSeverConnectionNotification
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
     * @param ServerConnectionTested $event
     *
     * @return void
     */
    public function handle(ServerConnectionTested $event)
    {
        return $event;
    }
}
