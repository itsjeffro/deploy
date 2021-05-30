<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Notification;
use Deploy\Models\User;
use Faker\Generator;

$factory->define(Notification::class, function (Generator $faker) {
    return [
        'user_id' => factory(User::class),
    ];
});
