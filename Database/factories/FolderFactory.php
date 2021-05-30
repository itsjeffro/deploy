<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Folder;
use Faker\Generator;

$factory->define(Folder::class, function (Generator $faker) {
    return [
        'from' => 'uploads',
        'to' => 'storage/uploads',
    ];
});
