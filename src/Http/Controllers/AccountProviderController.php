<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\DeployAccessToken;

class AccountProviderController extends Controller
{
    /**
     * List granted providers.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $providers = DeployAccessToken::select('provider_id')
            ->with(['provider'])
            ->where('user_id', auth()->id())
            ->groupBy('provider_id')
            ->get();

        return response()->json($providers);
    }
}
