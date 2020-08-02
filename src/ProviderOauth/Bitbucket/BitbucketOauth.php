<?php

namespace Deploy\ProviderOauth\Bitbucket;

use Deploy\Contracts\ProviderOauth\ProviderOauthInterface;
use Deploy\ProviderOauth\AbstractProviderOauth;

class BitbucketOauth extends AbstractProviderOauth implements ProviderOauthInterface
{
    /**
     * Returns provider friendly name typically stored in the providers table.
     *
     * @return string
     */
    public function getName(): string
    {
        return 'bitbucket';
    }

    /**
     * {@inheritdoc}
     */
    public function getAuthorizeUrl()
    {
        return 'https://bitbucket.org/site/oauth2/authorize?client_id=' . $this->getClientId() . '&response_type=code';
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
        $client = $this->getHttpClient();

        $response = $client->request('POST', $this->getApiUrl(), [
            'auth' => [
                $this->getClientId(),
                $this->getClientSecret(),
            ],
            'form_params' => [
                'grant_type' => 'authorization_code',
                'code' => $code,
            ]
        ]);

        return new BitbucketOauthResource(json_decode($response->getBody()));
    }

    /**
     * {@inheritdoc}
     */
    public function refreshAccessToken($refreshToken)
    {
        $client = $this->getHttpClient();

        $response = $client->request('POST', $this->getApiUrl(), [
            'auth' => [
                $this->getClientId(),
                $this->getClientSecret(),
            ],
            'form_params' => [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refreshToken,
            ]
        ]);

        return new BitbucketOauthResource(json_decode($response->getBody()));
    }
}
