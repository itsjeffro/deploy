<?php

namespace Deploy\ProviderRepository\Bitbucket\Resources;

use Deploy\ProviderRepository\Resource;

class CommitResource extends Resource
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'display_name' => $this->author->user->display_name,
            'avatar_link'  => $this->author->user->links->avatar->href,
            'hash'         => $this->hash,
            'commit_url'   => $this->links->html->href,
        ];
    }
}
