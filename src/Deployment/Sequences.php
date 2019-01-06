<?php

namespace Deploy\Deployment;

class Sequences
{
    /**
     * @var \Deploy\Models\Deployment
     */
    public $deployment;

    /**
     * Instantiate Sequences.
     *
     * @param \Deploy\Models\Deployment $deployment
     */
    public function __construct($deployment)
    {
        $this->deployment = $deployment;
    }

    /**
     * Return grouped processes by sequences.
     *
     * @return array
     */
    public function getSequences()
    {
        $sequences = [];

        foreach ($this->deployment->processes as $process) {
            $sequences[$process->sequence]['processes'][] = $process;
        }

        return $sequences;
    }
}
