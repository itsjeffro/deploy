<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Notification;
use Deploy\Resources\NotificationResource;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /** @var Notification */
    private $notification;

    /**
     * NotificationController constructor.
     */
    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Return list of notifications that belong to the currently logged in user.
     */
    public function index()
    {
        $userId = auth()->user()->id;

        $notifications = $this->notification
            ->where('is_read', 0)
            ->where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->paginate();

        return NotificationResource::collection($notifications);
    }

    /**
     * Returns notification that belongs to users attached to associated projects.
     */
    public function show(Notification $notification)
    {
        $this->authorize('view', $notification);

        $notification = $this->notification
            ->where('id', $notification->id)
            ->where('is_read', 0)
            ->first();

        return new NotificationResource($notification);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        $this->authorize('markAsRead', $notification);

        $notification->is_read = 1;
        $notification->read_at = new \DateTime();
        $notification->save();

        return response()->json(null, 204);
    }
}
