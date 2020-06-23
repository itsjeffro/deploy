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

        $notification->subject = $event->subject;
        $notification->model_type = $event->modelType;
        $notification->model_id = $event->modelId;
        $notification->contents = $event->exception->getMessage();
        $notification->reason = Notification::ERROR_TYPE;

        $notification->save();
    }
}
