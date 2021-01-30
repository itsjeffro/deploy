<?php

namespace Deploy\Http\Controllers;

class AuthController extends Controller
{
    /**
     * Return authenticated user.
     */
    public function user()
    {
        return auth()->user();
    }
}
