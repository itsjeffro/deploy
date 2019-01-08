<?php

namespace Deploy;

use GuzzleHttp\Client;
use InvalidArgumentException;

class ProviderRepositoryManager
{
    /**
     * @param string $providerFriendlyName
     * @param string $accessToken
     *
     * @return \Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface
     */
    public function driver($providerFriendlyName, $accessToken = '')
    {
        $client = new Client();
        $class = $this->buildDriver($providerFriendlyName);

        return new $class($client, $accessToken);
    }

    /**
     * @param string $providerFriendlyName
     *
     * @return mixed
     */
    protected function buildDriver($providerFriendlyName)
    {
        $config = config('deploy.providers');

        if (!array_key_exists($providerFriendlyName, $config)) {
            throw new InvalidArgumentException('Provider ['.$providerFriendlyName.'] is not registered in deploy config.');
        }

        return config('deploy.providers.'.$providerFriendlyName.'.repository');
    }
}
