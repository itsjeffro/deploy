<?php

namespace Deploy\ProviderRepository\Github\Resources;

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
            'commit' => $this->commit->sha,
        ];
    }
}
