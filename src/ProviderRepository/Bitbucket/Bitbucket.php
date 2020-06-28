<?php

namespace Deploy\ProviderRepository\Bitbucket;

use Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface;
use Deploy\ProviderRepository\ResourceCollection;
use Deploy\ProviderRepository\Bitbucket\Resources\BranchesResource;
use Deploy\ProviderRepository\Bitbucket\Resources\BranchResource;
use Deploy\ProviderRepository\Bitbucket\Resources\CommitsResource;
use Deploy\ProviderRepository\Bitbucket\Resources\TagsResource;
use Deploy\ProviderRepository\Bitbucket\Resources\CommitResource;
use Deploy\ProviderRepository\Bitbucket\Resources\RepositoryResource;

class Bitbucket extends ApiClient implements ProviderRepositoryInterface
{
    /**
     * {@inheritDoc}
     */
    public function getApiUrl()
    {
        return 'https://api.bitbucket.org/2.0';
    }

    /**
     * {@inheritDoc}
     */
    public function branches($userRepo)
    {
        $response = $this->request('GET', 'repositories/' . $userRepo . '/refs/branches');
        $branches = json_decode($response->getBody());
        
        return (new ResourceCollection())->toArray($branches->values, BranchesResource::class);
    }

    /**
     * {@inheritDoc}
     */
    public function branch($userRepo, $branch)
    {
        $response = $this->request('GET', 'repositories/' . $userRepo . '/refs/branches/' . $branch);
        $branch = json_decode($response->getBody());
        
        return (new BranchResource($branch))->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function commits($userRepo, $branch = '')
    {
        $branch = $branch ? '/'. $branch : '';

        $response = $this->request('GET', 'repositories/' . $userRepo . '/commits' . $branch);
        $commits = json_decode($response->getBody());
        
        return (new ResourceCollection())->toArray($commits->values, CommitsResource::class);
    }

    /**
     * {@inheritDoc}
     */
    public function commit($userRepo, $node)
    {
        $response = $this->request('GET', 'repositories/' . $userRepo . '/commit/' . $node);
        $commit = json_decode($response->getBody());
        
        return (new CommitResource($commit))->toArray();
    }

    /**
     * {@inheritDoc}
     */
    public function repository($userRepo)
    {
        $response = $this->request('GET', 'repositories/' . $userRepo);
        $repository = json_decode($response->getBody());
        
        return [
            'name' => $repository->name,
        ];
    }

    /**
     * {@inheritDoc}
     */
    public function tags($userRepo)
    {
        $response = $this->request('GET', 'repositories/' . $userRepo . '/refs/tags');
        $tags = json_decode($response->getBody());
        
        return (new ResourceCollection())->toArray($tags->values, TagsResource::class);
    }
}
