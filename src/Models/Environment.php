<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Environment extends Model
{
    /**
     * When a environment is syncing.
     *
     * @var integer
     */
    const SYNCING = 0;

    /**
     * When a environment has successfully synced.
     *
     * @var integer
     */
    const SYNCED = 1;

    /**
     * When an environment has failed syncing.
     *
     * @var integer
     */
    const FAILED_SYNC = 2;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'environments';

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'project_id',
        'contents',
    ];

    /**
     * Belongs to one project.
     */
    public function project()
    {
        return $this->belongsTo('Deploy\Models\Project');
    }

    /**
     * Servers that belong to the environment.
     */
    public function environmentServers()
    {
        return $this->hasMany('Deploy\Models\EnvironmentServer');
    }
}
