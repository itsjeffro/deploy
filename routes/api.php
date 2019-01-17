<?php

use Illuminate\Support\Facades\Route;

// Webhook
Route::post('webhook/{key}', 'DeploymentWebHookController@store')->name('webhook.store');