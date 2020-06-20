<?php

namespace Deploy\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class ProcessorErrorEvent
{
    use Dispatchable, SerializesModels;

    public $class;

    public $exception;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($class, $exception)
    {
        $this->class = $class;
        $this->exception = $exception;
    }
}
