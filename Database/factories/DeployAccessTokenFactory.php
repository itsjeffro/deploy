<?php

namespace Database\Factories;

use Deploy\Models\DeployAccessToken;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeployAccessTokenFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DeployAccessToken::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [];
    }
}
