<?php

namespace Deploy\Contracts\ProviderOauth;

interface ProviderOauthInterface
{
    /**
     * @return string
     */
    public function getClientId();

    /**
     * @return string
     */
    public function getClientSecret();

    /**
     * @return string
     */
    public function getApiUrl();

    /**
     * @return string
     */
    public function getAuthorizeUrl();

    /**
     * @param string $code
     *
     * @return \Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface
     */
    public function requestAccessToken($code);

    /**
     * @param string $refreshToken
     *
     * @return array
     */
    public function refreshAccessToken($refreshToken);

    /**
     * @return bool
     */
    public function hasRefreshToken();
}
