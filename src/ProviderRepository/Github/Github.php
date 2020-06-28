<?php

namespace Deploy\ProviderRepository\Github;

use Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface;
use Deploy\ProviderRepository\ResourceCollection;
use Deploy\ProviderRepository\Github\Resources\BranchResource;
use Deploy\ProviderRepository\Github\Resources\CommitResource;
use Deploy\ProviderRepository\Github\Resources\TagsResource;
use Deploy\ProviderRepository\Github\Resources\BranchesResource;

class Github extends ApiClient implements ProviderRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function getApiUrl()
    {
        return 'https://api.github.com/';
    }

    /**
     * {@inheritDoc}
     */
    public function branches($repository)
    {
        $response = $this->request('GET', 'repos/' . $repository . '/branches');
        $branches = json_decode($response->getBody());

        return (new ResourceCollection())->toArray($branches, BranchesResource::class);
    }

    /**
     * {@inheritDoc}
     */
    public function branch($repository, $branch)
    {
        $response = $this->request('GET', 'repos/' . $repository . '/branches/'. $branch);
        $branch = json_decode($response->getBody());

        return (new BranchResource($branch))->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function commit($repository, $commit)
    {
        $response = $this->request('GET', 'repos/' . $repository . '/commits/'. $commit);
        $commit = json_decode($response->getBody());

        return (new CommitResource($commit))->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function commits($repository, $branch = '')
    {
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function repository($userRepo)
    {
        $response = $this->request('GET', 'repos/' . $userRepo);
        $repository = json_decode($response->getBody());
        
        return [
            'name' => $repository->name,
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function tags($repository)
    {
        $response = $this->request('GET', 'repos/' . $repository . '/tags');
        $tags = json_decode($response->getBody());

        return (new ResourceCollection())->toArray($tags, TagsResource::class);
    }
}
