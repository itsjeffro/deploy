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
     */
    public function handle(ProcessorErrorEvent $event)
    {
        try {
            $notification = new Notification();

            $notification->subject = $event->subject;
            $notification->user_id = $event->userId;
            $notification->model_type = $event->modelType;
            $notification->model_id = $event->modelId;
            $notification->contents = $this->resolveExceptionMessage($event);
            $notification->reason = Notification::ERROR_TYPE;
    
            $notification->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Return exception message.
     */
    protected function resolveExceptionMessage(ProcessorErrorEvent $event): string
    {
        if (is_string($event->exception)) {
            return $event->exception;
        }

        if (method_exists($event->exception, 'getMessage')) {
            return $event->exception->getMessage();
        }

        return 'No exception message';
    }
}
