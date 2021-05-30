<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\User;
use Faker\Generator;

$factory->define(User::class, function (Generator $faker) {
    return [
        'name' => $faker->firstName(),
        'email' => $faker->email,
        'password' => 'password',
    ];
});
