<?php

namespace Deploy\ProviderRepository;

use GuzzleHttp\Client;

abstract class AbstractApiClient
{
    /**
     * @var string
     */
    protected $accessToken;

    /**
     * @var \GuzzleHttp\Client
     */
    protected $client;

    /**
     * Instantiate AbstractApiClient.
     *
     * @param \GuzzleHttp\Client $client
     * @param string             $accessToken
     */
    public function __construct(Client $client, $accessToken = '')
    {
        $this->client = $client;
        $this->accessToken = $accessToken;
    }

    /**
     * Send http request.
     *
     * @param string $method
     * @param string $endpoint
     *
     * @return object
     */
    abstract public function request($method, $endpoint);
}
