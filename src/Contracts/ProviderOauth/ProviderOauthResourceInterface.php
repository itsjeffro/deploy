<?php

namespace Deploy\Contracts\ProviderOauth;

interface ProviderOauthResourceInterface
{
    /**
     * Return the access token's type.
     *
     * @return string
     */
    public function getTokenType();
    /**
     * Return the access token.
     *
     * @return string
     */
    public function getAccessToken();
    /**
     * Return refresh token if one is provided for the access token.
     *
     * @return string
     */
    public function getRefreshToken();
    /**
     * Return scopes for the access token.
     * @return string
     */
    public function getScopes();
    /**
     * Return the access token's expiration time if one is provided.
     *
     * @return integer
     */
    public function getExpiration();
}
