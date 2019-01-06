<?php

namespace Deploy\ProviderRepository\Github\Resources;

use Deploy\ProviderRepository\Resource;

class CommitResource extends Resource
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'display_name' => $this->commit->author->name,
            'avatar_link'  => $this->author->avatar_url,
            'hash'         => $this->sha,
            'commit_url'   => $this->html_url,
        ];
    }
}