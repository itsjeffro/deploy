<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Environment extends Model
{
    /**
     * When a environment is syncing.
     *
     * @var int
     */
    const SYNCING = 0;

    /**
     * When a environment has successfully synced.
     *
     * @var int
     */
    const SYNCED = 1;

    /**
     * When an environment has failed syncing.
     *
     * @var int
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
    public function servers()
    {
        return $this->belongsToMany('Deploy\Models\Server');
    }
}
