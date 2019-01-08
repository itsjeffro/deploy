<?php

namespace Deploy\Http\Controllers;

use Deploy\Models\Provider;
use Deploy\ProviderOauthManager;
use Illuminate\Http\Request;

class ProviderAuthController extends Controller
{
    /**
     * Redirect the logged in user to their chosen provider so that they can
     * authorize this application to access the user's information.
     *
     * @param string $providerFriendlyName
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function authorizeUser($providerFriendlyName)
    {
        $provider = Provider::where('friendly_name', $providerFriendlyName)->first();

        $providerOauth = new ProviderOauthManager($provider, auth()->user());

        return redirect($providerOauth->getAuthorizeUrl());
    }

    /**
     * Retrieve the access token from the provider.
     *
     * @param \Illuminate\Http\Request $request
     * @param string                   $providerFriendlyName
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function providerAccessToken(Request $request, $providerFriendlyName)
    {
        $provider = Provider::where('friendly_name', $providerFriendlyName)->first();

        $providerOauth = new ProviderOauthManager($provider, auth()->user());

        $providerOauth->requestAccessToken($request->get('code'));

        return redirect()
            ->route('account')
            ->with(['message' => "Successfully integrated with {$provider->name}."]);
    }
}
