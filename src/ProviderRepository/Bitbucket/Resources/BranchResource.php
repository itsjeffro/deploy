<?php

namespace Deploy\ProviderRepository\Bitbucket\Resources;

use Deploy\ProviderRepository\Resource;

class BranchResource extends Resource
{
    /**
     * @return array
     */
    public function toArray()
    {
        return [
            'display_name' => $this->target->author->user->display_name,
            'avatar_link'  => $this->target->author->user->links->avatar->href,
            'hash'         => $this->target->hash,
            'commit_url'   => $this->target->links->html->href,
        ];
    }
}
