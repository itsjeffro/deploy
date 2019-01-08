<?php

namespace Deploy\ProviderOauth\Bitbucket;

use Deploy\ProviderOauth\AbstractProviderOauth;
use GuzzleHttp\Client;

class BitbucketOauth extends AbstractProviderOauth
{
    /**
     * {@inheritdoc}
     */
    public function getAuthorizeUrl()
    {
        return 'https://bitbucket.org/site/oauth2/authorize?client_id='.$this->getClientId().'&response_type=code';
    }

    /**
     * {@inheritdoc}
     */
    public function getApiUrl()
    {
        return 'https://bitbucket.org/site/oauth2/access_token';
    }

    /**
     * {@inheritdoc}
     */
    public function hasRefreshToken()
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function requestAccessToken($code)
    {
        $client = new Client();

        $response = $client->request('POST', $this->getApiUrl(), [
            'auth' => [
                $this->getClientId(),
                $this->getClientSecret(),
            ],
            'form_params' => [
                'grant_type' => 'authorization_code',
                'code'       => $code,
            ],
        ]);

        return new BitbucketOauthResource(json_decode($response->getBody()));
    }

    /**
     * {@inheritdoc}
     */
    public function refreshAccessToken($refreshToken)
    {
        $client = new Client();

        $response = $client->request('POST', $this->getApiUrl().'/access_token', [
            'auth' => [
                $this->clientId(),
                $this->clientSecret(),
            ],
            'form_params' => [
                'grant_type'    => 'refresh_token',
                'refresh_token' => $refreshToken,
            ],
        ]);

        return json_decode($response->getBody());
    }
}
