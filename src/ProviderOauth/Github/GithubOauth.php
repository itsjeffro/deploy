<?php

namespace Deploy\ProviderOauth\Github;

use Deploy\ProviderOauth\AbstractProviderOauth;
use GuzzleHttp\Client;

class GithubOauth extends AbstractProviderOauth
{
    /**
     * Authorization scopes.
     *
     * @var array
     */
    public $scopes = ['repo'];

    /**
     * {@inheritdoc}
     */
    public function getAuthorizeUrl()
    {
        $queries = [
            'client_id' => $this->getClientId(),
            'scope' => implode($this->scopes),
        ];

        return 'https://github.com/login/oauth/authorize?' . http_build_query($queries);
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
        $client = $this->getHttpClient();

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
