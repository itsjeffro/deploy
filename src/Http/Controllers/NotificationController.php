<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Notification;
use Deploy\Resources\NotificationResource;

class NotificationController extends Controller
{
    /** @var Notification */
    private $notification;

    /**
     * @param Notification $notification
     */
    public function __construct(Notification $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Return list of notfications that belong to the currently logged in user.
     *
     * @return JsonResponse
     */
    public function index()
    {
        $userId = auth()->user()->id;

        $notifications = $this->notification
            ->with('project')
            ->whereHas('project', function ($query) use ($userId) {
                return $query->where('user_id', $userId);
            })
            ->orderBy('id', 'desc')
            ->paginate();

        return NotificationResource::collection($notifications);
    }

    /**
     * Returns notification that belongs to users attached to associated projects.
     *
     * @param Notification $notification
     * @return JsonResponse
     */
    public function show(Notification $notification)
    {
        $this->authorize('view', $notification);

        $notification = $this->notification
            ->with('project')
            ->where('id', $notification->id)
            ->first();

        return new NotificationResource($notification);
    }
}
