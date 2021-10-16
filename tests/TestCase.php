<?php

namespace Deploy\Tests;

use Deploy\DeployServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Router;
use Orchestra\Testbench\Concerns\WithLaravelMigrations;

class TestCase extends \Orchestra\Testbench\TestCase
{
    use WithLaravelMigrations, RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->migrateDb();
    }

    protected function getPackageProviders($app): array
    {
        return [
            DeployServiceProvider::class,
        ];
    }

    protected function migrateDb(): void
    {
        $migrationsPath = realpath(__DIR__ . '/database/migrations');
        $migrationsPath = str_replace('\\', '/', $migrationsPath);

        $this
            ->artisan("migrate --database=testing --path={$migrationsPath} --realpath")
            ->assertExitCode(0);
    }

    protected function getEnvironmentSetUp($app)
    {
        config(['deploy.middleware' => 'bindings']);

        config(['database.default' => 'testing']);

        config([
            'deploy.models.user' => \Deploy\Models\User::class,
            'database.connections.testing' => [
                'driver' => 'mysql',
                'username' => env('DB_USERNAME', 'root'),
                'host' => env('DB_HOST', '127.0.0.1'),
                'port' => env('DB_PORT', '3306'),
                'password' => env('DB_PASSWORD'),
                'database' => 'deploy_test',
            ]
        ]);
    }
}
