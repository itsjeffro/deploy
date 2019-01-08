<?php

namespace Deploy\ProviderRepository\Github;

use Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface;
use Deploy\ProviderRepository\Github\Resources\BranchesResource;
use Deploy\ProviderRepository\Github\Resources\BranchResource;
use Deploy\ProviderRepository\Github\Resources\CommitResource;
use Deploy\ProviderRepository\Github\Resources\RepositoryResource;
use Deploy\ProviderRepository\Github\Resources\TagsResource;
use Deploy\ProviderRepository\ResourceCollection;

class Github extends ApiClient implements ProviderRepositoryInterface
{
    /**
     * {@inheritdoc}
     */
    public function getApiUrl()
    {
        return 'https://api.github.com/';
    }

    /**
     * {@inheritdoc}
     */
    public function branches($repository)
    {
        $response = $this->request('GET', 'repos/'.$repository.'/branches');
        $branches = json_decode($response->getBody());

        return (new ResourceCollection())->toArray($branches, BranchesResource::class);
    }

    /**
     * {@inheritdoc}
     */
    public function branch($repository, $branch)
    {
        $response = $this->request('GET', 'repos/'.$repository.'/branches/'.$branch);
        $branch = json_decode($response->getBody());

        return (new BranchResource($branch))->toArray();
    }

    /**
     * {@inheritdoc}
     */
    public function commit($repository, $commit)
    {
        $response = $this->request('GET', 'repos/'.$repository.'/commits/'.$commit);
        $commit = json_decode($response->getBody());

        return (new CommitResource($commit))->toArray();
    }

    /**
     * {@inheritdoc}
     */
    public function commits($repository, $branch = '')
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function repository($userRepo)
    {
        $response = $this->request('GET', 'repos/'.$userRepo);
        $repository = json_decode($response->getBody());

        return (new RepositoryResource($repository))->toArray();
    }

    /**
     * {@inheritdoc}
     */
    public function tags($repository)
    {
        $response = $this->request('GET', 'repos/'.$repository.'/tags');
        $tags = json_decode($response->getBody());

        return (new ResourceCollection())->toArray($tags, TagsResource::class);
    }
}
