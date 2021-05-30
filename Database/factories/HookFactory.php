<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Hook;
use Deploy\Models\Project;
use Faker\Generator;

$factory->define(Hook::class, function (Generator $faker) {
    return [
        'name' => 'Hello, world',
        'script' => 'echo "hello, world!";',
        'project_id' => factory(Project::class),
        'position' => 1,
    ];
});
