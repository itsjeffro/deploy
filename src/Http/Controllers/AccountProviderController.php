<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\Resources\ProviderResource;
use Illuminate\Http\JsonResponse;

class AccountProviderController extends Controller
{
    /**
     * AccountProviderController construct.
     */
    public function __construct(Provider $provider)
    {
        $this->provider = $provider;
    }

    /**
     * List granted providers.
     */
    public function index(): JsonResponse
    {
        $providers = $this->provider
            ->with(['deployAccessToken' => function ($query) {
                return $query->where('user_id', auth()->id());
            }])
            ->get();

        return response()->json(ProviderResource::collection($providers));
    }
}
