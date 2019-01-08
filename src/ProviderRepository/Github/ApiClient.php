<?php

namespace Deploy\ProviderRepository\Github;

use Deploy\ProviderRepository\AbstractApiClient;

class ApiClient extends AbstractApiClient
{
    /**
     * {@inheritdoc}
     */
    public function request($method, $endpoint)
    {
        $queryAcessToken = empty($this->accessToken) ? '' : '?access_token='.$this->accessToken;

        return $this->client->request('GET', $this->getApiUrl().$endpoint.$queryAcessToken, [
            'headers' => [
                'Accept' => 'application/vnd.github.v3+json',
            ],
        ]);
    }
}
