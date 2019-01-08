<?php

namespace Deploy\ProviderRepository\Bitbucket;

use Deploy\ProviderRepository\AbstractApiClient;

class ApiClient extends AbstractApiClient
{
    /**
     * @var string
     */
    protected $endpoint;

    /**
     * @var array
     */
    protected $endpointParams = [];

    /**
     * {@inheritdoc}
     */
    public function request($method, $endpoint)
    {
        return $this->client->request($method, $this->getApiUrl().'/'.$endpoint, [
            'headers' => $this->getHeaders(),
        ]);
    }

    /**
     * Return header options.
     *
     * @return array
     */
    protected function getHeaders()
    {
        return empty($this->accessToken) ? [] : ['Authorization' => 'Bearer '.$this->accessToken];
    }

    /**
     * Store fields to return in request.
     *
     * @param array $fields
     *
     * @return $this
     */
    public function fields(array $fields = [])
    {
        $this->endpointParams['fields'] = (is_array($fields) && !empty($fields)) ? $fields : [];

        return $this;
    }

    /**
     * Build the params for the endpoint to return. Includes fields, query, sort etc.
     *
     * @return string
     */
    protected function buildEndpointParams()
    {
        $endpointParams = [];

        foreach ($this->endpointParams as $key => $value) {
            if (!empty($value)) {
                array_push($endpointParams, $key.'='.implode(',', $value));
            }
        }

        return '?'.implode('&', $endpointParams);
    }

    /**
     * Return first record from response.
     *
     * @return array
     */
    public function first()
    {
        if (empty($this->endpoint)) {
            throw new \Exception('No endpoint specified');
        }

        $this->endpointParams['pagelen'] = [1];

        $queryEndpoint = $this->buildEndpointParams();

        $response = json_decode($this->request('GET', $this->endpoint.$queryEndpoint));

        return (!empty($response)) ? $response->values[0] : [];
    }
}
