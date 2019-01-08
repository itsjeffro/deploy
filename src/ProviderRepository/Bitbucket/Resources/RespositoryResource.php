<?php

namespace Deploy\ProviderRepository\Bitbucket\Resources;

use Deploy\ProviderRepository\Resource;

class RespositoryResource extends Resource
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'name' => $this->name,
        ];
    }
}
