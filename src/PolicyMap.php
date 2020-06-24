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
        'Deploy\Models\Server' => 'Deploy\Policies\ServerPolicy',
        'Deploy\Models\Deployment' => 'Deploy\Policies\DeploymentPolicy',
        'Deploy\Models\Hook' => 'Deploy\Policies\HookPolicy',
        'Deploy\Models\Process' => 'Deploy\Policies\ProcessPolicy',
        'Deploy\Models\Folder' => 'Deploy\Policies\FolderPolicy',
        'Deploy\Models\Notification' => 'Deploy\Policies\NotificationPolicy',
    ];
}
