<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;
use Illuminate\Http\Request;

class RepositoryBranchesTagsController extends Controller
{
    /** @var ProviderOauthManager */
    private $providerOauthManager;

    /**
     * @param ProviderOauthManager $providerOauthManager
     */
    public function __construct(ProviderOauthManager $providerOauthManager)
    {
        $this->providerOauthManager = $providerOauthManager;
    }
    
    /**
     * Return repository's branch list.
     *
     * @param  \Illuminate\Http\Request $request
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
            'tags' => $driver->tags($repository),
        ]);
    }

    /**
     * Retrieve access token.
     *
     * @param  \Deploy\Models\Provider $provider
     * @return string
     */
    protected function accessToken($provider)
    {
        $user = auth()->user();

        $providerOauth = $this->providerOauthManager
            ->setProvider($provider)
            ->setUser($user);

        return $providerOauth->getAccessToken();
    }
}
