<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Server extends Model
{
    use SoftDeletes;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'servers';
    
    /**
     * @var array
     */
    public $fillable = [
        'project_id',
        'user_id',
        'name',
        'ip_address',
        'port',
        'connect_as',
        'project_path',
        'public_key',
    ];
    
    /**
     * Belongs to one project.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo('Deploy\Models\Project', 'project_id');
    }

    /**
     * Projects that the server belongs to.
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * Project server relationship.
     */
    public function projectServer(): HasOne
    {
        return $this->hasOne(ProjectServer::class);
    }

    /**
     * Belongs to one user.
     */
    public function user(): BelongsTo
    {
        $userModel = config('deploy.models.user', '\App\User');

        return $this->belongsTo($userModel);
    }
}
