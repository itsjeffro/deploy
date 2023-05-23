<?php

namespace Database\Factories;

use Deploy\Models\Hook;
use Deploy\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class HookFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Hook::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => 'Hello, world',
            'script' => 'echo "hello, world!";',
            'project_id' => Project::factory(),
            'position' => 1,
        ];
    }
}
