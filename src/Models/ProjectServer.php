<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'project_path',
    ];

    /**
     * Server relationship.
     */
    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    /**
     * Project relationship.
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
