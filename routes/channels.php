<?php

use Deploy\Models\Project;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('project.{project}', function ($user, Project $project) {
    return (int) $user->id === (int) $project->user_id;
});