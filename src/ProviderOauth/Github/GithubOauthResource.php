<?php

namespace Deploy\ProviderOauth\Github;

use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;

class GithubOauthResource implements ProviderOauthResourceInterface
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
        return '';
    }

    /**
     * @return string
     */
    public function getScopes()
    {
        return isset($this->token->scope) ? $this->token->scope : '';
    }

    /**
     * @return int
     */
    public function getExpiration()
    {
        return 0;
    }
}
