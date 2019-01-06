<?php

namespace Deploy\Listeners;

use Deploy\Events\ServerConnectionTested;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

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
     * @param  ServerConnectionTested  $event
     * @return void
     */
    public function handle(ServerConnectionTested $event)
    {
        return $event;
    }
}
