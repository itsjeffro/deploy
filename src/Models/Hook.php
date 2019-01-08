<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Hook extends Model
{
    /**
     * @var int
     */
    const ACTION_CLONE_RELEASE = 1;

    /**
     * @var int
     */
    const ACTION_ACTIVATE_NEW_RELEASE = 2;

    /**
     * @var int
     */
    const ACTION_CLEAN_UP = 3;

    /**
     * @var int
     */
    const POSITION_BEFORE = 1;

    /**
     * @var int
     */
    const POSITION_AFTER = 2;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'hooks';

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'project_id',
        'action_id',
        'name',
        'script',
        'order',
        'position',
    ];

    /**
     * Belongs to one project.
     */
    public function project()
    {
        return $this->belongsTo('Deploy\Models\Project');
    }

    /**
     * Scope query to only include hooks created for before actions.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBeforeAction($query)
    {
        return $query->where('position', self::POSITION_BEFORE);
    }

    /**
     * Scope query to only include hooks created for before actions.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAfterAction($query)
    {
        return $query->where('position', self::POSITION_AFTER);
    }
}
