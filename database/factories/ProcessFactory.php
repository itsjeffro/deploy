<?php

namespace Database\Factories;

use Deploy\Models\Process;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProcessFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Process::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => 'Clone New Release',
            'server_name' => 'Server name',
            'output' => 'Cloning a new release ...',
            'sequence' => 1,
            'status' => 1,
        ];
    }
}
