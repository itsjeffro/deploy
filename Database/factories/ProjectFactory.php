<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Project;
use Deploy\Models\User;
use Faker\Generator;
use Illuminate\Support\Str;

$factory->define(Project::class, function (Generator $faker) {
    return [
        'name' => $faker->word,
        'key' => Str::random(),
        'repository' => 'https://github.com/itsjeffro/deploy.git',
        'branch' => 'master',
        'provider_id' => 1,
        'user_id' => factory(User::class),
    ];
});
