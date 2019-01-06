<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class EnvironmentServer extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'environment_server';

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'evironment_id',
        'server_id',
    ];

    /**
     * Belongs to one environment.
     */
    public function environment()
    {
        return $this->belongsTo('Deploy\Models\Environment');
    }

    /**
     * Belongs to one server.
     */
    public function server()
    {
        return $this->belongsTo('Deploy\Models\Server');
    }
}
