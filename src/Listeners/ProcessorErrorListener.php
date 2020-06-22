<?php

namespace Deploy\Listeners;

use Deploy\Events\ProcessorErrorEvent;
use Deploy\Models\Notification;
use Illuminate\Support\Facades\Log;

class ProcessorErrorListener
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
     * @param ProcessorError $event
     * @return void
     */
    public function handle(ProcessorErrorEvent $event)
    {
        $notification = new Notification();

        $notification->user_id = 0;
        $notification->project_id = 2;
        $notification->subject = $event->class;
        $notification->contents = $event->exception->getMessage();
        $notification->type = Notification::ERROR_TYPE;

        $notification->save();
    }
}
