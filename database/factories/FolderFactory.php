<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Folder;
use Deploy\Models\User;
use Faker\Generator;
use Illuminate\Support\Str;

$factory->define(Folder::class, function (Generator $faker) {
    return [
        'from' => 'uploads',
        'to' => 'storage/uploads',
    ];
});
