<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'folders';

    /**
     * Fillable table column.
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'from',
        'to',
    ];

    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function newFactory()
    {
        return \Database\Factories\FolderFactory::new();
    }

    /**
     * Belongs to one project.
     */
    public function project()
    {
        return $this->belongsTo('Deploy\Models\Project', 'project_id');
    }
}