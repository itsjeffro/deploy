<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'api'], function() {
    // Projects
    Route::get('projects', 'ProjectController@index')->name('projects.index');
    Route::post('projects', 'ProjectController@store')->name('project.store');
    Route::get('projects/{project}', 'ProjectController@show')->name('projects.show');
    Route::delete('projects/{project}', 'ProjectController@destroy')->name('projects.destroy');
    Route::put('projects/{project}', 'ProjectController@update')->name('project.update');

    // Project's key
    Route::put('projects/{project}/key', 'ProjectKeyController@update')->name('project-key.update');

    // Project's deployments
    Route::get('projects/{project}/deployments', 'ProjectDeploymentsController@index')->name('project-deployments.index');
    Route::get('projects/{project}/deployments/{deployment}', 'ProjectDeploymentsController@show')->name('project-deployments.show');
    Route::post('projects/{project}/deployments', 'ProjectDeploymentsController@store')->name('project-deployments.store');

    // Project deployment's process
    Route::get('projects/{project}/deployments/{deployment}/process/{process}', 'ProjectDeploymentProcessController@show')->name('project-deployment-process.show');

    // Project's actions
    Route::get('projects/{project}/actions', 'ProjectActionsController@index')->name('project-actions.index');
    Route::get('projects/{project}/actions/{action}', 'ProjectActionsController@show')->name('project-actions.show');

    // Project action's hooks
    Route::get('projects/{project}/actions/{action}/hooks/{hook}', 'ProjectActionHooksController@show')->name('project-action-hooks.show');
    Route::post('projects/{project}/actions/{action}/hooks', 'ProjectActionHooksController@store')->name('project-action-hooks.store');
    Route::put('projects/{project}/actions/{action}/hooks/{hook}', 'ProjectActionHooksController@update')->name('project-action-hooks.update');
    Route::delete('projects/{project}/actions/{action}/hooks/{hook}', 'ProjectActionHooksController@destroy')->name('project-action-hooks.destroy');

    // Project's servers
    Route::post('projects/{project}/servers', 'ProjectServerController@store')->name('project-servers.store');
    Route::get('projects/{project}/servers/{server}', 'ProjectServerController@show')->name('project-servers.show');
    Route::put('projects/{project}/servers/{server}', 'ProjectServerController@update')->name('project-servers.update');
    Route::delete('projects/{project}/servers/{server}', 'ProjectServerController@destroy')->name('project-servers.destroy');

    // Project's server test connection
    Route::get('projects/{project}/servers/{server}/test-connection', 'ProjectServerTestConnectionController@show')->name('project-server-test-connection.show');

    // Project's folders
    Route::get('projects/{project}/folders', 'ProjectFoldersController@index')->name('project-folders.index');
    Route::post('projects/{project}/folders', 'ProjectFoldersController@store')->name('project-folders.store');
    Route::delete('projects/{project}/folders/{folder}', 'ProjectFoldersController@destroy')->name('project-folders.destroy');

    // Project's environment reset
    Route::put('projects/{project}/environment-reset', 'ProjectEnvironmentResetController@update')->name('project-environment-reset.update');

    // Project's environment unlock
    Route::post('projects/{project}/environment-unlock', 'ProjectEnvironmentUnlockController@store')->name('project-environment-unlock.store');

    // Project's environment
    Route::put('projects/{project}/environment', 'ProjectEnvironmentController@update')->name('project-environment.update');

    // Project redeploy
    Route::post('redeployments', 'RedeploymentController@store')->name('redeployments.store');

    // Account providers
    Route::get('account-providers', 'AccountProviderController@index')->name('account-providers.index');

    // Repository
    Route::get('repositories/branches-tags', 'RepositoryBranchesTagsController@index')->name('repository-branches-tags.index');

    // Notification
    Route::get('notifications', 'NotificationController@index');
    Route::get('notifications/{notification}', 'NotificationController@show');
    Route::post('notifications/{notification}/read', 'NotificationController@markAsRead');
});

// Provider auth
Route::get('authorize/{provider}', 'ProviderAuthController@authorizeUser')->name('provider-authorize.get');
Route::get('authorize/{provider}/access', 'ProviderAuthController@providerAccessToken')->name('provider-access-token.get');
Route::get('authorize/{provider}/refresh', 'ProviderAuthController@providerRefreshToken')->name('provider-refresh-token.get');

// Dashboard
Route::get('/{view?}', 'DashboardController@index')->where('view', '(.*)')->name('deploy');
