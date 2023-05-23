<?php

namespace Database\Factories;

use Deploy\Models\Deployment;
use Deploy\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeploymentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Deployment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'project_id' => Project::factory(),
            'committer' => $this->faker->userName,
            'committer_avatar' => 'https://path/to/image.jpg',
            'repository' => 'https://github.com/itsjeffro/deploy.git',
            'reference' => 'branch',
            'branch' => 'master',
            'commit' => $this->faker->sha1,
            'commit_url' => 'https://path/to/commit',
        ];
    }
}
