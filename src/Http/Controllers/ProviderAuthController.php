<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\ProviderOauthManager;
use Illuminate\Http\Request;

class ProviderAuthController extends Controller
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
     * Redirect the logged in user to their chosen provider so that they can
     * authorize this application to access the user's information.
     *
     * @param  string $providerFriendlyName
     * @return \Illuminate\Http\RedirectResponse
     */
    public function authorizeUser($providerFriendlyName)
    {
        $provider = Provider::where('friendly_name', $providerFriendlyName)->first();

        $user = auth()->user();

        $authorizerUrl = $this->providerOauthManager
            ->setProvider($provider)
            ->setUser($user)
            ->getAuthorizeUrl();

        return redirect($authorizerUrl);
    }

    /**
     * Retrieve the access token from the provider.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  string $providerFriendlyName
     * @return \Illuminate\Http\RedirectResponse
     */
    public function providerAccessToken(Request $request, $providerFriendlyName)
    {
        $provider = Provider::where('friendly_name', $providerFriendlyName)->first();

        $user = auth()->user();

        $this->providerOauthManager
            ->setProvider($provider)
            ->setUser($user)
            ->requestAccessToken($request->get('code'));

        return redirect()->route('deploy');
    }
}