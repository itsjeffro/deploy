<?php

namespace Database\Factories;

use Deploy\Models\Project;
use Deploy\Models\Server;
use Deploy\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ServerFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Server::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'name' => 'Server name',
            'port' => 3306,
            'ip_address' => '127.0.0.1',
            'connect_as' => 'root',
            'public_key' => 'ssh-rsa random-key',
        ];
    }
}
