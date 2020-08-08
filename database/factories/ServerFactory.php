<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use Deploy\Models\Project;
use Deploy\Models\Server;
use Deploy\Models\User;
use Faker\Generator;

$factory->define(Server::class, function (Generator $faker) {
    return [
        'project_id' => factory(Project::class),
        'user_id' => factory(User::class),
        'name' => 'Server name',
        'port' => 3306,
        'ip_address' => '127.0.0.1',
        'connect_as' => 'root',
        'project_path' => '/var/www/html',
        'public_key' => 'ssh-rsa random-key',
    ];
});
