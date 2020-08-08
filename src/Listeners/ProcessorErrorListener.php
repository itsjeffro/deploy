<?php

namespace Deploy\Listeners;

use Deploy\Events\ProcessorErrorEvent;
use Deploy\Models\Notification;
use Exception;

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
        try {
            $notification = new Notification();

            $notification->subject = $event->subject;
            $notification->project_id = $event->projectId;
            $notification->model_type = $event->modelType;
            $notification->model_id = $event->modelId;
            $notification->contents = $event->exception->getMessage();
            $notification->reason = Notification::ERROR_TYPE;
    
            $notification->save();
        } catch (Exception $e) {
            throw $event->exception;
        }
    }
}
