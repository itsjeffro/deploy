<?php

namespace Database\Factories;

use Deploy\Models\Project;
use Deploy\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'key' => Str::random(),
            'repository' => 'https://github.com/itsjeffro/deploy.git',
            'branch' => 'master',
            'provider_id' => 1,
            'user_id' => User::factory(),
        ];
    }
}
