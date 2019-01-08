<?php

namespace Deploy\Jobs;

use Deploy\Processors\ServerConnectionProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class TestConnectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @var \Deploy\Processors\ServerConnectionProcessor
     */
    protected $serverConnectionProcessor;

    /**
     * Create a new job instance.
     *
     * @param \Deploy\Models\Server $server
     *
     * @return void
     */
    public function __construct($server)
    {
        $this->serverConnectionProcessor = new ServerConnectionProcessor($server);
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->serverConnectionProcessor->fire();
    }
}
