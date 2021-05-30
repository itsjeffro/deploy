<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use SoftDeletes, HasFactory;

    /** @var string */
    const INFO_TYPE = 'info';

    /** @var string */
    const ERROR_TYPE = 'error';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deploy_notifications';

    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function newFactory()
    {
        return \Database\Factories\NotificationFactory::new();
    }

    /**
     * Belongs to one project.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * Belongs to one user.
     */
    public function user(): BelongsTo
    {
        $userModel = config('deploy.models.user', User::class);

        return $this->belongsTo($userModel);
    }
}
