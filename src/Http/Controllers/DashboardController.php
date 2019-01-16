<?php

namespace Deploy\Http\Controllers;

use Deploy\Deploy;

class DashboardController extends Controller
{
    /**
     * Entry point for react application.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('deploy::dashboard.index', [
            'deployVariables' => json_encode(Deploy::scriptVariables())
        ]);
    }
}
