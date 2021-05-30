<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Environment;
use Deploy\Models\Project;
use Faker\Generator;

$factory->define(Environment::class, function (Generator $faker) {
    return [
        'contents' => '',
        'project_id' => factory(Project::class),
    ];
});
