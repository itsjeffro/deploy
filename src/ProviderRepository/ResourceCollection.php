<?php

namespace Deploy\ProviderRepository;

class ResourceCollection
{
    /**
     * @param  array $resources
     * @param  string $transformer
     * @return array
     */
    public function toArray(array $resources, $transformer)
    {
        return array_map(function ($resource) use ($transformer) {
            return (new $transformer($resource))->toArray();
        }, $resources);
    }
}
