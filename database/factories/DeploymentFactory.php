<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Deployment;
use Deploy\Models\Project;
use Faker\Generator;

$factory->define(Deployment::class, function (Generator $faker) {
    return [
        'project_id' => factory(Project::class),
        'committer' => $faker->userName,
        'committer_avatar' => 'https://path/to/image.jpg',
        'repository' => 'https://github.com/itsjeffro/deploy.git',
        'reference' => 'branch',
        'branch' => 'master',
        'commit' => $faker->sha1,
        'commit_url' => 'https://path/to/commit',
    ];
});
