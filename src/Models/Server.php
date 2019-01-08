<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;
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
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function project()
    {
        return $this->belongsTo('Deploy\Models\Project', 'project_id');
    }
}
