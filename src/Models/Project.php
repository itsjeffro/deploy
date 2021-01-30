<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    /**
     * @var string
     */
    const PROVIDER_BITBUCKET = 'bitbucket';

    /**
     * @var string
     */
    const PROVIDER_GITHUB = 'github';

    /**
     * @var string
     */
    const MASTER_BRANCH = 'master';

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'projects';

    /**
     * The relations to eager load on every query.
     *
     * @var array
     */
    protected $with = [
        'projectServers',
        'environmentServers',
        'folders',
        'lastDeployment',
        'provider',
        'user',
    ];

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'key',
        'user_id',
        'name',
        'provider_id',
        'repository',
        'branch',
        'deploy_on_push',
        'releases',
    ];

    /**
     * Get project environment servers.
     */
    public function environmentServers(): HasManyThrough
    {
        return $this->hasManyThrough(EnvironmentServer::class, Environment::class);
    }

    /**
     * Get deployments for the project.
     */
    public function deployments(): HasMany
    {
        return $this->hasMany(Deployment::class);
    }

    /**
     * Get symlink folders for the project.
     */
    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }

    /**
     * Get servers for the project.
     */
    public function servers():BelongsToMany
    {
        return $this->belongsToMany(Server::class);
    }

    /**
     * Get the last deployment for the project.
     */
    public function lastDeployment(): HasOne
    {
        return $this->hasOne(Deployment::class)
            ->latest()
            ->withDefault([
                'duration' => null,
            ]);
    }

    /**
     * Get provider.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * Project belongs to one user.
     */
    public function user(): BelongsTo
    {
        $model = config('deploy.models.user') ?? 'App\User';

        return $this->belongsTo($model);
    }

    /**
     * Links between project and server.
     */
    public function projectServers(): HasMany
    {
        return $this->hasMany(ProjectServer::class);
    }
}
