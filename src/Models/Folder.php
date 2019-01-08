<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'folders';

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
        'from',
        'to',
    ];

    /**
     * Belongs to one project.
     */
    public function project()
    {
        return $this->belongsTo('Deploy\Models\Project', 'project_id');
    }
}
