<?php

namespace Deploy\Tests;

use Deploy\DeployServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Routing\Router;

class TestCase extends \Orchestra\Testbench\TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->withFactories(__DIR__ . '/../database/factories');

        $this->loadLaravelMigrations(['--database' => 'testing']);
        
        $this->artisan('migrate', ['--database' => 'testing']);
    }

    protected function getPackageProviders($app): array
    {
        return [
            DeployServiceProvider::class,
        ];
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
