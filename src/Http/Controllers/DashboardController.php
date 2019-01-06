<?php

namespace Deploy\Http\Controllers;

class DashboardController extends Controller
{
    /**
     * Entry point for react application.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('deploy::dashboard.index');
    }
}
