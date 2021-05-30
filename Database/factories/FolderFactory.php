<?php

namespace Database\Factories;

use Deploy\Models\Folder;
use Illuminate\Database\Eloquent\Factories\Factory;

class FolderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Folder::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'from' => 'uploads',
            'to' => 'storage/uploads',
        ];
    }
}
