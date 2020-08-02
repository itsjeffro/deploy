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
        return $this->getValidatedAccessToken($this->provider, $this->user);
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
     * Requests a new access token from the OAuth provider.
     *
     * @param string $code
     * @return string
     * @throws Exception
     */
    public function requestAccessToken(string $code): string
    {
        $requestedToken = $this->getProviderOauthClass()->requestAccessToken($code);

        $this->storeAccessToken($requestedToken);

        return $requestedToken->getAccessToken();
    }

    /**
     * Returns the most recent access token for the user along. If the access token
     * has an associated refresh token, then that will also be returned as well.
     *
     * @param  Provider $provider
     * @param  User $user
     * @return string
     * 
     * @throws Exception
     */
    private function getValidatedAccessToken($provider, $user): string
    {
        $accessToken = DeployAccessToken::where('provider_id', $provider->id)
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'DESC')
            ->first();

        if (!$accessToken instanceof DeployAccessToken) {
            throw new Exception(
                sprintf('A valid access token was not found for provider [%d]. Try requesting a new one.', $provider->id)
            );
        }

        if (!$this->getProviderOauthClass()->hasRefreshToken()) {
            return $accessToken->id;
        }

        if (!$this->isAccessTokenExpired($accessToken)) {
            return $accessToken->id;
        }
        
        // If the provider uses refresh tokens and our access token is now expired. We will get the refresh token
        // associated with the access token and try to make a request for a new access token from the provider.
        $refreshToken = DeployRefreshToken::where('deploy_access_token_id', $accessToken->id)->first();

        if (!$refreshToken instanceof DeployRefreshToken) {
            throw new \Exception('Could not find an associated refresh token for the expired access token. Try requesting a new one.');
        }

        $response = $this->getProviderOauthClass()->refreshAccessToken($refreshToken->id);

        $this->storeAccessToken($response);

        return $response->getAccessToken();
    }

    /**
     * Stores the access token.
     *
     * @param ProviderOauthResourceInterface $requestedToken
     * @return DeployAccessToken
     * @throws Exception
     */
    private function storeAccessToken($requestedToken)
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
    private function storeRefreshToken($requestedToken)
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
            'id' => $requestedToken->getRefreshToken(),
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
    private function formatExpirationDateTime($requestedToken)
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
    private function isAccessTokenExpired($token)
    {
        $dateTime = new DateTime;

        return $dateTime->format('Y-m-d H:i:s') >= $token->expires_at;
    }

    /**
     * Returns an instance of the oauth for specified provider.
     *
     * @return AbstractProviderOauth
     */
    private function getProviderOauthClass()
    {
        $providerName = $this->provider->friendly_name;

        $provider = $this->config->get('deploy.providers.' . $providerName . '.oauth');
        $clientId = $this->config->get('deploy.providers.' . $providerName . '.key');
        $clientSecret = $this->config->get('deploy.providers.' . $providerName . '.secret');

        return new $provider($clientId, $clientSecret);
    }
}
