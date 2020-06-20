<?php

namespace Deploy\Listeners;

use Deploy\Events\ProcessorErrorEvent;
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
        Log::error('Processor exception was thrown', [
            'class' => $event->class,
            'message' => $event->exception->getMessage(),
        ]);
    }
}
