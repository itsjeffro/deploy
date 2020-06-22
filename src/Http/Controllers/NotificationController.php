<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Notification;

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
            ->where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->paginate();

        return response()->json($notifications);
    }

    /**
     * Show the specified notification belonging to the user.
     *   
     * @return JsonResponse
     */
    public function show(Notification $notification)
    {
        $this->authorize('view', $notification);
    
        return response()->json($notification);
    }
}
