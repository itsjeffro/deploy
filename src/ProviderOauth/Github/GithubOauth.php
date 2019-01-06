<?php

namespace Deploy\ProviderOauth\Github;

use Deploy\ProviderOauth\AbstractProviderOauth;
use GuzzleHttp\Client;

class GithubOauth extends AbstractProviderOauth
{
    /**
     * {@inheritdoc}
     */
    public function getAuthorizeUrl()
    {
        return 'https://github.com/login/oauth/authorize?client_id=' . $this->getClientId();
    }

    /**
     * {@inheritdoc}
     */
    public function getApiUrl()
    {
        return 'https://github.com/login/oauth/access_token';
    }

    /**
     * {@inheritdoc}
     */
    public function hasRefreshToken()
    {
        return false;
    }

    /**
     * {@inheritdoc}
     */
    public function requestAccessToken($code)
    {
        $client = new Client();

        $response = $client->request('POST', $this->getApiUrl(), [
            'headers' => [
                'Accept' => 'application/json'
            ],
            'form_params' => [
                'client_id'     => $this->getClientId(),
                'client_secret' => $this->getClientSecret(),
                'grant_type'    => 'authorization_code',
                'code'          => $code,
            ]
        ]);

        return new GithubOauthResource(json_decode($response->getBody()));
    }

    /**
     * {@inheritdoc}
     */
    public function refreshAccessToken($refreshToken)
    {
        return [];
    }
}
