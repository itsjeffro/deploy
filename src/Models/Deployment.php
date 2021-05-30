<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deployment extends Model
{
    use HasFactory;

    /**
     * @param integer
     */
    const FAILED = 0;

    /**
     * @param integer
     */
    const FINISHED = 1;

    /**
     * @param integer
     */
    const QUEUED = 2;

    /**
     * @param integer
     */
    const DEPLOYING = 3;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deployments';

    /**
     * Fillable table column.
     *
     * @var array
     */
    protected $fillable = [
        'project_id',
        'status',
        'committer',
        'committer_avatar',
        'commit',
        'commit_url',
        'raw_output',
        'started_at',
        'duration',
        'branch',
        'repository',
        'reference',
    ];

    /**
     * Mutatable dates.
     *
     * @var array
     */
    protected $dates = [
        'started_at',
    ];

    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function newFactory()
    {
        return \Database\Factories\DeploymentFactory::new();
    }

    /**
     * Deployment belongs to one project.
     */
    public function project()
    {
        return $this->belongsTo('Deploy\Models\Project');
    }

    /**
     * Deployment has many DeploymentStepProgress records through DeploymentStep.
     */
    public function processes()
    {
        return $this->hasMany('Deploy\Models\Process');
    }

    /**
     * Get deployments made {n} days ago.
     *
     * @return \Illuminate\Database\Query\Builder
     */
    public function scopeByDaysAgo($query, $days)
    {
        $week = \Carbon\Carbon::now()->subDays($days);

        return $query->where('created_at', '>', $week);
    }

    /**
     * Get deployments made today.
     *
     * @return \Illuminate\Database\Query\Builder
     */
    public function scopeByToday($query)
    {
        $start = \Carbon\Carbon::now()->startOfDay();
        $end = \Carbon\Carbon::now()->endOfDay();

        return $query->whereBetween('created_at', [$start, $end]);
    }

    /**
     * Return started at.
     *
     * @return string
     */
    public function getStartedAt()
    {
        return $this->started_at->format('d F h:i a');
    }
}