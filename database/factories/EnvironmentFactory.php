<?php

namespace Database\Factories;

use Deploy\Models\Environment;
use Deploy\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class EnvironmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Environment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'contents' => '',
            'project_id' => Project::factory(),
        ];
    }
}
