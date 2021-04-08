<?php

namespace Deploy\Events;

use Deploy\Models\Project;
use Deploy\Models\Server;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class EnvironmentSynced implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /** @var int */
    public $serverId;

    /** @var int */
    public $userId;

    /** @var int */
    public $status;

    /**
     * Create a new event instance.
     *
     * @param int $serverId
     * @param int $status
     * @return void
     */
    public function __construct(Server $server, int $status)
    {
        $this->serverId = $server->id;
        $this->userId = $server->user_id;
        $this->status = $status;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('user.' . $this->userId);
    }
}
