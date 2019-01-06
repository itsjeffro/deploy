<?php

namespace Deploy\ProviderOauth;

abstract class AbstractProviderOauth
{
    /**
     * Provider client id.
     *
     * @var string
     */
    protected $clientId;

    /**
     * Provider client secret.
     *
     * @var string
     */
    protected $clientSecret;

    /**
     * Instantiate OAuth instance.
     *
     * @param string $clientId
     * @param string $clientSecret
     */
    public function __construct($clientId, $clientSecret)
    {
        $this->clientId = $clientId;
        $this->clientSecret = $clientSecret;
    }

    /**
     * Get authorization url for provider.
     *
     * @return string
     */
    abstract public function getAuthorizeUrl();

    /**
     * Get provider url to request access token from.
     *
     * @return string
     */
    abstract public function getApiUrl();

    /**
     * Indicates if the provider uses refresh tokens.
     *
     * @return bool
     */
    abstract public function hasRefreshToken();

    /**
     * Retrieve the access token from the provider.
     *
     * @param  string $code
     * @return \Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface
     */
    abstract public function requestAccessToken($code);

    /**
     * Use the refresh token that was provided with the access token to refresh the
     * access token. A new access token is provided when the refresh token is used.
     *
     * @param  string $refreshToken
     * @return array
     */
    abstract public function refreshAccessToken($refreshToken);

    /**
     * Get client id.
     *
     * @return string
     */
    public function getClientId()
    {
        return $this->clientId;
    }

    /**
     * Get client secret.
     *
     * @return string
     */
    public function getClientSecret()
    {
        return $this->clientSecret;
    }
}
