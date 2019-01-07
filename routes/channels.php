<?php

use Deploy\Models\Project;

Broadcast::channel('project.{project}', function ($user, Project $project) {
    return (int) $user->id === (int) $project->user_id;
});
