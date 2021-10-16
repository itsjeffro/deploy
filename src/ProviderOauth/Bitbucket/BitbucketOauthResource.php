<?php

namespace Deploy\ProviderOauth\Bitbucket;

use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;
use Illuminate\Support\Arr;

class BitbucketOauthResource implements ProviderOauthResourceInterface
{
    /**
     * The bitbucket token data from when we requested an access token.
     *
     * @var array
     */
    private $token;

    /**
     * BitbucketOauthResource constructor.
     */
    public function __construct(array $token)
    {
        $this->token = $token;
    }

    /**
     * Returns token type.
     */
    public function getTokenType(): string
    {
        return Arr::get($this->token, 'token_type', '');
    }

    /**
     * Returns access token.
     */
    public function getAccessToken(): string
    {
        return Arr::get($this->token, 'access_token', '');
    }

    /**
     * Returns refresh token.
     */
    public function getRefreshToken(): string
    {
        return Arr::get($this->token, 'refresh_token', '');
    }

    /**
     * Returns scopes.
     */
    public function getScopes(): string
    {
        return Arr::get($this->token, 'scopes', '');
    }

    /**
     * Returns expiration date.
     */
    public function getExpiration(): int
    {
        return (int) Arr::get($this->token, 'expires_in', 0);
    }
}
