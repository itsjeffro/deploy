<?php

namespace Deploy\ProviderOauth;

use Deploy\Contracts\ProviderOauth\ProviderOauthInterface;
use Deploy\ProviderOauth\Bitbucket\BitbucketOauth;
use Deploy\ProviderOauth\Github\GithubOauth;
use RuntimeException;

class ProviderOauthFactory
{
    /** @var string */
    const GITHUB_PROVIDER = 'github';

    /** @var string */
    const BITBUCKET_PROVIDER = 'bitbucket';

    public static function create(string $provider): ProviderOauthInterface
    {
        if (self::GITHUB_PROVIDER === $provider) {
            $clientId = config('deploy.providers.github.key', '');
            $clientSecret = config('deploy.providers.github.secret', '');

            return new GithubOauth($clientId, $clientSecret);
        }

        if (self::BITBUCKET_PROVIDER === $provider) {
            $clientId = config('deploy.providers.bitbucket.key', '');
            $clientSecret = config('deploy.providers.bitbucket.secret', '');

            return new BitbucketOauth($clientId, $clientSecret);
        }

        throw new RuntimeException(sprintf('The requested [%s] provider is not valid.', $provider));
    }
}
