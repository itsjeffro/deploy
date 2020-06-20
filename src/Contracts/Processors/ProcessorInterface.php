<?php

namespace Deploy\Contracts\Processors;

interface ProcessorInterface
{
    /**
     * Fires processor.
     *
     * @return void
     */
    public function fire();
}
