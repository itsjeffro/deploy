<?php

namespace Deploy;

use Deploy\Models\DeployAccessToken;
use Deploy\Models\DeployRefreshToken;
use DateTime;
use Deployer\Exception\Exception;

class ProviderOauthManager
{
    /**
     * @var \Deploy\Models\Provider
     */
    private $provider;

    /**
     * @var \App\User
     */
    private $user;

    /**
     * Instantiate ProviderOauth.
     *
     * @param \App\Provider
     * @param \App\User
     */
    public function __construct($provider, $user)
    {
        $this->provider = $provider;
        $this->user = $user;
    }

    /**
     * Return provider access token.
     *
     * @return string
     * @throws Exception
     */
    public function getAccessToken()
    {
        $accessToken = $this->getDeployAccessToken($this->provider, $this->user);

        return $accessToken->id;
    }

    /**
     * Returns any existing valid access token for the specified repository provider.
     * If the there is no access token, the access token has expired, or there is
     * no expiry date on the access token, then a new token will be provided.
     *
     * @param string $code
     * @return DeployAccessToken
     */
    public function requestAccessToken($code)
    {
        $token = $this->getDeployAccessToken($this->provider, $this->user);

        if (!$token instanceof DeployAccessToken || empty($token->expires_at) || $this->isAccessTokenExpired($token)) {
            $requestedToken = $this->getProviderOauthClass()->requestAccessToken($code);

            return $this->storeAccessToken($requestedToken);
        }

        if (!$this->getProviderOauthClass()->hasRefreshToken()) {
            return $token;
        }

        return $token;
    }

    /**
     * [description]
     *
     * @param  \Deploy\Models\Provider $provider
     * @param  \App\User $user
     * @return \Deploy\Models\DeployAccessToken
     */
    public function getDeployAccessToken($provider, $user)
    {
        return DeployAccessToken::where('provider_id', $provider->id)
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'DESC')
            ->first();
    }

    /**
     * Return providers url for authorizing a request for an access token.
     *
     * @return string
     */
    public function getAuthorizeUrl()
    {
        return $this->getProviderOauthClass()->getAuthorizeUrl();
    }

    /**
     * [description]
     *
     * @param  \Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface $requestedToken
     * @return \Deploy\Models\DeployAccessToken
     */
    public function storeAccessToken($requestedToken)
    {
        $accessToken = new DeployAccessToken();
        $accessToken->fill([
            'id'          => $requestedToken->getAccessToken(),
            'user_id'     => $this->user->id,
            'provider_id' => $this->provider->id,
            'scopes'      => $requestedToken->getScopes(),
            'revoked'     => 0,
            'expires_at'  => $this->formatExpirationDateTime($requestedToken),
            'token_type'  => $requestedToken->getTokenType(),
        ]);
        $accessToken->save();

        if ($this->getProviderOauthClass()->hasRefreshToken()) {
            $this->storeRefreshToken($requestedToken);
        }

        return $accessToken;
    }

    /**
     * If a refresh token exists, then update record with new access token.
     * Otherwise if a refresh token does not exist, create a new record.
     *
     * @param \Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface $requestedToken
     */
    public function storeRefreshToken($requestedToken)
    {
        if (DeployRefreshToken::find($requestedToken->getRefreshToken())) {
            DeployRefreshToken::where('id', $requestedToken->getRefreshToken())
                ->update([
                    'deploy_access_token_id' => $requestedToken->getAccessToken(),
                ]);

            return;
        }

        $refreshToken = new DeployRefreshToken();
        $refreshToken->fill([
            'id' => $requestedToken->getAccessToken(),
            'deploy_access_token_id' => $requestedToken->getAccessToken(),
            'revoked' => 0,
            'expires_at' => date('Y-m-d H:i:s'),
        ]);
        $refreshToken->save();
    }

    /**
     * [description]
     *
     * @param  \Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface $requestedToken
     * @return string|null
     */
    protected function formatExpirationDateTime($requestedToken)
    {
        if ($requestedToken->getExpiration()) {
            $dateTime = new DateTime();
            $timestamp = time() + $requestedToken->getExpiration();

            return $dateTime->setTimestamp($timestamp)
                ->format('Y-m-d H:i:s');
        }

        return null;
    }

    /**
     * [description]
     *
     * @param  \Deploy\Models\DeployAccessToken $token
     * @return bool
     */
    protected function isAccessTokenExpired($token)
    {
        $dateTime = new DateTime;

        return $dateTime->format('Y-m-d H:i:s') >= $token->expires_at;
    }

    /**
     * Get instance of the oauth for specified provider.
     *
     * @return \Deploy\ProviderOauth\AbstractProviderOauth
     */
    protected function getProviderOauthClass()
    {
        $providerName = $this->provider->friendly_name;

        $provider = config('deploy.providers.' . $providerName . '.oauth');
        $clientId = config('deploy.providers.' . $providerName . '.key');
        $clientSecret = config('deploy.providers.' . $providerName . '.secret');

        return new $provider($clientId, $clientSecret);
    }
}
