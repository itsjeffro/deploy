<?php

namespace Deploy\Http\Controllers;

use Deploy\Deploy;

class DashboardController extends Controller
{
    /**
     * Entry point for react application.
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        return view('deploy::app', [
            'deployVariables' => json_encode(Deploy::scriptVariables())
        ]);
    }
}