<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Project;
use Faker\Generator;

$factory->define(Project::class, function (Generator $faker) {
    return [
        'name' => $faker->title,
    ];
});
