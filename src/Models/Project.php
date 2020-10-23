<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

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
        'environmentServers',
        'user',
        'servers',
        'folders',
        'lastDeployment',
        'provider',
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
    public function environmentServers()
    {
        return $this->hasManyThrough('Deploy\Models\EnvironmentServer', 'Deploy\Models\Environment');
    }

    /**
     * Get deployments for the project.
     */
    public function deployments()
    {
        return $this->hasMany('Deploy\Models\Deployment');
    }

    /**
     * Get symlink folders for the project.
     */
    public function folders()
    {
        return $this->hasMany('Deploy\Models\Folder');
    }

    /**
     * Get servers for the project.
     */
    public function servers()
    {
        return $this->hasMany('Deploy\Models\Server');
    }

    /**
     * Get the last deployment for the project.
     */
    public function lastDeployment()
    {
        return $this->hasOne('Deploy\Models\Deployment')
            ->latest()
            ->withDefault([
                'duration' => null,
            ]);
    }

    /**
     * Get provider.
     */
    public function provider()
    {
        return $this->belongsTo('Deploy\Models\Provider');
    }

    /**
     * Project belongs to one user.
     */
    public function user()
    {
        $model = config('deploy.models.user') ?? 'App\User';

        return $this->belongsTo($model);
    }
}
