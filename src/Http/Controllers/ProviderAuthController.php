<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\ProviderOauth\ProviderOauthFactory;
use Deploy\ProviderOauthManager;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProviderAuthController extends Controller
{
    /** @var ProviderOauthManager */
    private $providerOauthManager;

    /**
     * ProviderAuthController constructor.
     */
    public function __construct(ProviderOauthManager $providerOauthManager)
    {
        $this->providerOauthManager = $providerOauthManager;
    }

    /**
     * Redirect the logged in user to their chosen provider so that they can
     * authorize this application to access the user's information.
     */
    public function authorizeUser(string $providerFriendlyName): RedirectResponse
    {
        $provider = ProviderOauthFactory::create($providerFriendlyName);

        $user = auth()->user();

        $authorizerUrl = $this->providerOauthManager
            ->setProvider($provider)
            ->setUser($user)
            ->getAuthorizeUrl();

        return redirect($authorizerUrl);
    }

    /**
     * Retrieve the access token from the provider.
     */
    public function providerAccessToken(Request $request, string $providerFriendlyName): RedirectResponse
    {
        $providerOauth = ProviderOauthFactory::create($providerFriendlyName);
        
        $user = auth()->user();

        $this->providerOauthManager
            ->setProvider($providerOauth)
            ->setUser($user)
            ->requestAccessToken($request->get('code'));

        return redirect()->route('deploy');
    }
}
