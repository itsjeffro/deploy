<?php

namespace Deploy\Jobs;

use Deploy\Processors\ServerConnectionProcessor;
use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Deploy\Models\Server;

class TestConnectionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var Server */
    protected $server;

    /**
     * Create a new job instance.
     *
     * @param Server $server
     * @return void
     */
    public function __construct(Server $server)
    {
        $this->server = $server;
    }

    /**
     * Execute the job.
     *
     * @param ServerConnectionProcessor $processor
     * @return void
     */
    public function handle(ServerConnectionProcessor $processor)
    {
        $processor
            ->setServer($this->server)
            ->fire();
    }
}
