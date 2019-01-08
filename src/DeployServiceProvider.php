<?php

namespace Deploy;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class DeployServiceProvider extends ServiceProvider
{
    use EventMap, PolicyMap;

    /**
     * Register bindings in the container.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerRoutes();
        $this->registerEvents();
        $this->registerResources();
        $this->registerMigrations();
        $this->registerPolicies();
    }

    /**
     * Regsiter package's events and listeners.
     *
     * @return void
     */
    protected function registerEvents()
    {
        $events = $this->app->make(Dispatcher::class);

        foreach ($this->events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $events->listen($event, $listener);
            }
        }
    }

    /**
     * Regsiter package's routes.
     *
     * @return void
     */
    protected function registerRoutes()
    {
        Route::group([
            'prefix'     => config('deploy.path'),
            'namespace'  => 'Deploy\Http\Controllers',
            'middleware' => config('deploy.middleware'),
        ], function () {
            $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        });
    }

    /**
     * Regsiter package's resources.
     *
     * @return void
     */
    protected function registerResources()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'deploy');
    }

    /**
     * Register the package's migrations.
     *
     * @return void
     */
    protected function registerMigrations()
    {
        if ($this->app->runningInConsole()) {
            $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        }
    }

    /**
     * Register the package's policies.
     *
     * @return void
     */
    protected function registerPolicies()
    {
        foreach ($this->policies as $key => $value) {
            Gate::policy($key, $value);
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->offerPublishing();
    }

    /**
     * Setup the resource publishing groups for the package.
     *
     * @return void
     */
    protected function offerPublishing()
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/deploy.php' => config_path('deploy.php'),
            ], 'deploy-config');

            $this->publishes([
                __DIR__.'/../public' => public_path('vendor/deploy'),
            ], 'deploy-assets');
        }
    }
}
