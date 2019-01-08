<?php

namespace Deploy\ProviderRepository\Bitbucket\Resources;

use Deploy\ProviderRepository\Resource;

class TagsResource extends Resource
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'name'   => $this->name,
            'commit' => $this->target->hash,
        ];
    }
}
