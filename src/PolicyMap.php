<?php 

namespace Deploy;

trait PolicyMap
{
    /**
     * All of the Deploy policy mappings.
     *
     * @var array
     */
    protected $policies = [
        'Deploy\Models\Project' => 'Deploy\Policies\ProjectPolicy',
    ];
}
