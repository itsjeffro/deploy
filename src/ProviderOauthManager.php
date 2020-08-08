<?php

namespace Deploy;

use App\User;
use Deploy\Contracts\ProviderOauth\ProviderOauthResourceInterface;
use Deploy\Models\DeployAccessToken;
use Deploy\Models\DeployRefreshToken;
use DateTime;
use Deploy\Contracts\ProviderOauth\ProviderOauthInterface;
use Deploy\Models\Provider;
use Exception;

class ProviderOauthManager
{
    /** @var ProviderOauthInterface */
    private $providerOauth;

    /** @var User */
    private $user;

    /**
     * @param ProviderOauthInterface $provider
     * @return self
     */
    public function setProvider(ProviderOauthInterface $providerOauth): self
    {
        $this->providerOauth = $providerOauth;

        return $this;
    }

    /**
     * @param User $user
     * @return self
     */
    public function setUser($user): self
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
    public function getAccessToken(): string
    {
        $providerOauth = $this->providerOauth;

        $user = $this->user;

        $provider = Provider::where('friendly_name', $providerOauth->getName())->first();

        $accessToken = DeployAccessToken::where('provider_id', $provider->id)
            ->where('user_id', $user->id)
            ->orderBy('created_at', 'DESC')
            ->first();

        if (!$accessToken instanceof DeployAccessToken) {
            throw new Exception(sprintf('A valid access token was not found for provider [%d]. Try requesting a new one.', $provider->id));
        }

        if (!$this->providerOauth->hasRefreshToken()) {
            return $accessToken->id;
        }

        if (!$this->isAccessTokenExpired($accessToken)) {
            return $accessToken->id;
        }
        
        return $this->refreshAccessToken($accessToken);
    }

    /**
     * Returns the authorization url to of the specified repository provider.
     *
     * @return string
     */
    public function getAuthorizeUrl(): string
    {
        return $this->providerOauth->getAuthorizeUrl();
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
        $requestedToken = $this->providerOauth->requestAccessToken($code);

        $this->storeAccessToken($requestedToken);

        return $requestedToken->getAccessToken();
    }

    /**
     * If the provider uses refresh tokens and our access token is now expired. We will get the refresh token
     * associated with the access token and try to make a request for a new access token from the provider.
     *
     * @param DeployAccessToken $accessToken
     * @return string
     */
    private function refreshAccessToken(DeployAccessToken $accessToken): string
    {
        $refreshToken = DeployRefreshToken::where('deploy_access_token_id', $accessToken->id)->first();

        if (!$refreshToken instanceof DeployRefreshToken) {
            throw new \Exception('Refresh token for the expired access token could not be found. Try requesting a new one.');
        }

        $response = $this->providerOauth->refreshAccessToken($refreshToken->id);

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
        $provider = Provider::where('friendly_name', $this->providerOauth->getName())->first();

        $accessToken = new DeployAccessToken();

        $accessToken->fill([
            'id'          => $requestedToken->getAccessToken(),
            'user_id'     => $this->user->id,
            'provider_id' => $provider->id,
            'scopes'      => $requestedToken->getScopes(),
            'revoked'     => 0,
            'expires_at'  => $this->formatExpirationDateTime($requestedToken),
            'token_type'  => $requestedToken->getTokenType(),
        ]);

        $accessToken->save();

        if ($this->providerOauth->hasRefreshToken()) {
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

            return $dateTime
                ->setTimestamp($timestamp)
                ->format('Y-m-d H:i:s');
        }

        return null;
    }

    /**
     * Checks if the access token from the specified repository provider has expired.
     *
     * @param DeployAccessToken $token
     * @return bool
     */
    private function isAccessTokenExpired(DeployAccessToken $token): bool
    {
        $dateTime = new DateTime;

        return $dateTime->format('Y-m-d H:i:s') >= $token->expires_at;
    }
}
