<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Process;
use Faker\Generator;

$factory->define(Process::class, function (Generator $faker) {
    return [
        'name' => 'Clone New Release',
        'server_name' => 'Server name',
        'output' => 'Cloning a new release ...',
        'sequence' => 1,
        'status' => 1,
    ];
});