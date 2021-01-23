<?php

namespace Deploy\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;

class ProcessorErrorEvent
{
    use Dispatchable, SerializesModels;

    /** @var string */
    public $subject;

    /** @var mixed */
    public $exception;

    /** @var string */
    public $modelType;
    
    /** @var mixed */
    public $modelId;

    /** @var string */
    public $userId;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(string $subject, string $userId, $model, $exception)
    {
        $this->subject = $subject;
        $this->userId = $userId;
        $this->modelType = get_class($model);
        $this->modelId = $model->id;
        $this->exception = $exception;
    }
}
