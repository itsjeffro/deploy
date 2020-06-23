<?php

namespace Deploy\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class ProcessorErrorEvent
{
    use Dispatchable, SerializesModels;

    /** @var mixed */
    public $subject;

    /** @var mixed */
    public $exception;

    /** @var string */
    public $modelType;
    
    /** @var string */
    public $modelId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($subject, $exception, $model)
    {
        $this->subject = $subject;
        $this->exception = $exception;
        $this->modelType = get_class($model);
        $this->modelId = $model->id;
    }
}
