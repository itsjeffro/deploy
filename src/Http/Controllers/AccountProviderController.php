<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;

class AccountProviderController extends Controller
{
    /**
     * List granted providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $providers = Provider::with(['deployAccessToken' => function ($query) {
            return $query->where('user_id', auth()->id());
        }])
        ->get();


        return response()->json($providers);
    }
}
