<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Action extends Model
{
    /**
     * @var int
     */
    const BEFORE_POSITION = 1;

    /**
     * @var int
     */
    const AFTER_POSITION = 2;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'actions';

    /**
     * Fillable table column.
     *
     * @var array
     */
    public $fillable = [
        'name',
        'order',
    ];

    /**
     * Action has many before hooks.
     */
    public function beforeHooks()
    {
        return $this->hasMany('Deploy\Models\Hook')->where('position', self::BEFORE_POSITION);
    }

    /**
     * Action has many after hooks.
     */
    public function afterHooks()
    {
        return $this->hasMany('Deploy\Models\Hook')->where('position', self::AFTER_POSITION);
    }

    /**
     * Get before and after hooks by project.
     *
     * @param \Deploy\Models\Project $project
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function getHooksByProject($project)
    {
        return $this->with([
            'beforeHooks' => function ($query) use ($project) {
                $query->where('project_id', $project->id);
            },
            'afterHooks' => function ($query) use ($project) {
                $query->where('project_id', $project->id);
            },
        ]);
    }
}
