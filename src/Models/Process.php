<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Process extends Model
{
    /**
     * @param int
     */
    const FINISHED = 1;

    /**
     * @param int
     */
    const FAILED = 2;

    /**
     * @param int
     */
    const RUNNING = 3;

    /**
     * @param int
     */
    const CANCELLED = 4;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'processes';

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'deployment_id',
        'server_id',
    ];

    /**
     * Deployment step progress has one server.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function server()
    {
        return $this->belongsTo('Deploy\Models\Server');
    }

    /**
     * Process belongs to Deployment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function deployment()
    {
        return $this->belongsTo('Deploy\Models\Deployment');
    }

    /**
     * Process belongs to hook.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function hook()
    {
        return $this->belongsTo('Deploy\Models\Hook');
    }
}
