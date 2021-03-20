<?php

namespace Deploy\Http\Controllers;

use Deploy\Deploy;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\View\View;

class DashboardController extends Controller
{
    /**
     * Entry point for react application.
     *
     * @return Application|Factory|View
     */
    public function index()
    {
        return view('deploy::app', [
            'deployVariables' => json_encode(Deploy::scriptVariables())
        ]);
    }
}