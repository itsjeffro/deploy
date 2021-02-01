<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\ProviderOauth\ProviderOauthFactory;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RepositoryBranchesTagsController extends Controller
{
    /** @var ProviderOauthManager */
    private $providerOauthManager;

    /** @var ProviderRepositoryManager */
    private $providerRepositoryManager;

    /**
     * RepositoryBranchesTagsController constructor.
     */
    public function __construct(
        ProviderOauthManager $providerOauthManager,
        ProviderRepositoryManager $providerRepositoryManager
    ) {
        $this->providerOauthManager = $providerOauthManager;
        $this->providerRepositoryManager = $providerRepositoryManager;
    }

    /**
     * Return repository's branch list.
     */
    public function index(Request $request): JsonResponse
    {
        $providerId = $request->get('provider_id');
        $repository = $request->get('repository');

        $provider = Provider::find($providerId);

        if (!$provider instanceof Provider) {
            return response()->json(['Provider not found.'], 404);
        }

        $driver = $this->providerRepositoryManager
            ->driver(
                $provider->friendly_name,
                $this->accessToken($provider)
            );

        return response()->json([
            'branches' => $driver->branches($repository),
            'tags' => $driver->tags($repository),
        ]);
    }

    /**
     * Retrieve access token.
     */
    protected function accessToken(Provider $provider): string
    {
        $providerOauth = ProviderOauthFactory::create($provider->friendly_name);

        $user = auth()->user();

        $providerOauth = $this->providerOauthManager
            ->setProvider($providerOauth)
            ->setUser($user);

        return $providerOauth->getAccessToken();
    }
}
