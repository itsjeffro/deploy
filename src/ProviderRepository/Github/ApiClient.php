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
        $headers = [
            'Accept' => 'application/vnd.github.v3+json',
        ];

        if (!empty($this->accessToken)) {
            $headers['Authorization'] = 'Bearer ' . $this->accessToken;
        }

        return $this->client->request('GET', $this->getApiUrl() . $endpoint, [
            'headers' => $headers,
        ]);
    }
}
