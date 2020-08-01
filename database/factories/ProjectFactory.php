<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Project;
use Deploy\Models\User;
use Faker\Generator;

$factory->define(Project::class, function (Generator $faker) {
    return [
        'name' => $faker->title,
        'key' => 'ssh-rsa random-public-key',
        'repository' => 'https://github.com/itsjeffro/deploy.git',
        'branch' => 'master',
        'provider_id' => 1,
        'user_id' => factory(User::class),
    ];
});
