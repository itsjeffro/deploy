<?php

namespace Database\Factories;

use Deploy\Models\DeployRefreshToken;
use Illuminate\Database\Eloquent\Factories\Factory;

class DeployRefreshTokenFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = DeployRefreshToken::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'revoked' => 0,
        ];
    }
}