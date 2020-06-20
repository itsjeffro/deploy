<?php

namespace Deploy;

use App\User;
use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;
use Deploy\Models\DeployAccessToken;
use Deploy\Models\DeployRefreshToken;
use DateTime;
use Deploy\Models\Provider;
use Deploy\ProviderOauth\AbstractProviderOauth;
use Exception;
use Illuminate\Contracts\Config\Repository as Config;

class ProviderOauthManager
{
    /** @var Provider */
    private $provider;

    /** @var User */
    private $user;

    /** @var Config */
    private $config;

    /**
     * @param $config
     */
    public function __construct(Config $config)
    {
        $this->config = $config;
    }

    /**
     * @param Provider $provider
     * @return self
     */
    public function setProvider($provider)
    {
        $this->provider = $provider;

        return $this;
    }

    /**
     * @param User $user
     * @return self
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Returns the last stored access token ID of the specified provider.
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
     * @throws Exception
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
     * Returns the stored provider access token model.
     *
     * @param  Provider $provider
     * @param  User $user
     * @return DeployAccessToken
     */
    public function getDeployAccessToken($provider, $user)
    {
        return DeployAccessToken::where('provider_id', $provider->id)
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'DESC')
            ->first();
    }

    /**
     * Returns the authorization url to of the specified repository provider.
     *
     * @return string
     */
    public function getAuthorizeUrl()
    {
        return $this->getProviderOauthClass()->getAuthorizeUrl();
    }

    /**
     * Stores the access token.
     *
     * @param ProviderOauthResourceInterface $requestedToken
     * @return DeployAccessToken
     * @throws Exception
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
     * @param ProviderOauthResourceInterface $requestedToken
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
     * Formats the provided token's expiry date.
     *
     * @param  ProviderOauthResourceInterface $requestedToken
     * @return string|null
     * @throws Exception
     */
    public function formatExpirationDateTime($requestedToken)
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
     * Checks if the access token from the specified repository provider has expired.
     *
     * @param DeployAccessToken $token
     * @return bool
     * @throws Exception
     */
    protected function isAccessTokenExpired($token)
    {
        $dateTime = new DateTime;

        return $dateTime->format('Y-m-d H:i:s') >= $token->expires_at;
    }

    /**
     * Returns an instance of the oauth for specified provider.
     *
     * @return AbstractProviderOauth
     */
    protected function getProviderOauthClass()
    {
        $providerName = $this->provider->friendly_name;

        $provider = $this->config->get('deploy.providers.' . $providerName . '.oauth');
        $clientId = $this->config->get('deploy.providers.' . $providerName . '.key');
        $clientSecret = $this->config->get('deploy.providers.' . $providerName . '.secret');

        return new $provider($clientId, $clientSecret);
    }
}
