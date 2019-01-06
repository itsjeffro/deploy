<?php

namespace Deploy\ProviderRepository\Github\Resources;

use Deploy\ProviderRepository\Resource;

class BranchResource extends Resource
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'display_name' => $this->commit->commit->author->name,
            'avatar_link' => $this->commit->author->avatar_url,
            'hash' => $this->commit->sha,
            'commit_url' => $this->commit->html_url,
        ];
    }
}