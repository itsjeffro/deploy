<?php

namespace Deploy\ProviderOauth\Bitbucket;

use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;

class BitbucketOauthResource implements ProviderOauthResourceInterface
{
    /**
     * @var object
     */
    private $token;

    /**
     * Instantiate OauthResponse.
     *
     * @param object $token
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * @return string
     */
    public function getTokenType()
    {
        return isset($this->token->token_type) ? $this->token->token_type : '';
    }

    /**
     * @return string
     */
    public function getAccessToken()
    {
        return isset($this->token->access_token) ? $this->token->access_token : '';
    }

    /**
     * @return string
     */
    public function getRefreshToken()
    {
        return isset($this->token->refresh_token) ? $this->token->refresh_token : '';
    }

    /**
     * @return string
     */
    public function getScopes()
    {
        return isset($this->token->scopes) ? $this->token->scopes : '';
    }

    /**
     * @return integer
     */
    public function getExpiration()
    {
        return isset($this->token->expires_in) ? $this->token->expires_in : 0;
    }
}
