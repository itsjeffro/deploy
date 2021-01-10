<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectServer extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'project_server';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'project_id',
        'server_id',
    ];
}
