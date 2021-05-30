<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hook extends Model
{
    use HasFactory;

    /**
     * @var integer
     */
    const ACTION_CLONE_RELEASE = 1;

    /**
     * @var integer
     */
    const ACTION_ACTIVATE_NEW_RELEASE = 2;

    /**
     * @var integer
     */
    const ACTION_CLEAN_UP = 3;

    /**
     * @var integer
     */
    const POSITION_BEFORE = 1;

    /**
     * @var integer
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
    protected $fillable = [
        'project_id',
        'action_id',
        'name',
        'script',
        'order',
        'position',
    ];

    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function newFactory()
    {
        return \Database\Factories\HookFactory::new();
    }

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
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAfterAction($query)
    {
        return $query->where('position', self::POSITION_AFTER);
    }
}
