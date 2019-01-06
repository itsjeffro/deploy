<?php

namespace Deploy\ProviderRepository;

class Resource
{
    private $resource;

    /**
     * JsonResource constructor.
     *
     * @param $resource
     */
    public function __construct($resource)
    {
        $this->resource = $resource;
    }
    
    /**
     * Dynamically call properties from the resources property.
     *
     * @param  string $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->resource->{$key};
    }
}