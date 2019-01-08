<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;
use Illuminate\Http\Request;

class RepositoryBranchesTagsController extends Controller
{
    /**
     * Return repository's branch list.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $providerId = $request->get('provider_id');
        $repository = $request->get('repository');

        $provider = Provider::find($providerId);

        if (!is_object($provider)) {
            return response()->json(['Provider not found.'], 404);
        }

        $providerRepository = new ProviderRepositoryManager();
        $driver = $providerRepository->driver($provider->friendly_name, $this->accessToken($provider));

        return response()->json([
            'branches' => $driver->branches($repository),
            'tags'     => $driver->tags($repository),
        ]);
    }

    /**
     * Retrieve access token.
     *
     * @param \Deploy\Models\Provider $provider
     *
     * @return string
     */
    protected function accessToken($provider)
    {
        $providerOauth = new ProviderOauthManager($provider, auth()->user());

        return $providerOauth->getAccessToken();
    }
}
