<?php

namespace Deploy\ProviderRepository;

use Deploy\Models\Project;
use Deploy\ProviderOauth\ProviderOauthFactory;
use InvalidArgumentException;
use Deploy\ProviderOauthManager;
use Deploy\ProviderRepositoryManager;

class Commit
{
    /**
     * The reference type refers to a branch, tag, commit.
     *
     * @var string
     */
    public $referenceType;

    /**
     * The reference value refers to a name of a branch, name of a tag or the commit hash.
     *
     * @var string
     */
    public $referenceValue;
    
    /**
     * @var \Deploy\Contracts\ProviderRepository\ProviderRepositoryInterface
     */
    public $providerRepositoryManager;

    /**
     * Instantiate.
     *
     * @param  string $referenceType
     * @param  string $referenceValue
     * @return void
     */
    public function __construct($referenceType, $referenceValue)
    {
        $this->referenceType = $referenceType;
        $this->referenceValue = $referenceValue; 
    }

    /**
     * Returns commit data.
     *
     * @param  \Deploy\Models\Project $project
     * @return array
     * @throws \InvalidArgumentException
     */
    public function getByProject(Project $project)
    {
        $this->providerRepositoryManager = $this->getRepositoryManager($project);
        
        if ($this->referenceType === Reference::BRANCH_TYPE) {
            return $this->dataFromBranch($project->repository, $this->referenceValue);
        }

        if ($this->referenceType === Reference::COMMIT_TYPE) {
            return $this->dataFromCommit($project->repository, $this->referenceValue);
        }

        if ($this->referenceType === Reference::TAG_TYPE) {
            return $this->dataFromTag($project->repository, $this->referenceValue);
        }

        throw new InvalidArgumentException('Invalid [' . $this->referenceType . '] reference type.');
    }

    /**
     * Get data from repository branch.
     *
     * @param  string $repository
     * @param  string $branch
     * @return array
     */
    public function dataFromBranch($repository, $branch)
    {
        return $this->providerRepositoryManager->branch($repository, $branch);
    }

    /**
     * Get data from repository commit.
     *
     * @param  string $repository
     * @param  string $commit
     * @return array
     */
    public function dataFromCommit($repository, $commit)
    {
        return $this->providerRepositoryManager->commit($repository, $commit);
    }

    /**
     * Get data from repository tag.
     *
     * @param  string $repository
     * @param  string $tagName
     * @return array
     */
    public function dataFromTag($repository, $tagName)
    {
        $tags = $this->providerRepositoryManager->tags($repository);

        return $this->dataFromCommit(
            $repository,
            $this->getCommitHashFromtag($tags, $tagName)
        );
    }

    /**
     * Return tag commit hash if there is a matching tag name in the tags list.
     *
     * @param  array $tags
     * @param  string $tagName
     * @return string
     * @throws \InvalidArgumentException
     */
    public function getCommitHashFromtag(array $tags, $tagName)
    {
        foreach ($tags as $tag) {
            if (strpos($tag['name'], $tagName) !== false) {
                return $tag['commit'];
            }
        }
        
        throw new InvalidArgumentException('Cannot retrieve tag\'s commit hash from invalid [' . $tagName . '] tag.');
    }

    /**
     * Get instance of ProviderRepositoryManager using the specified provider.
     *
     * @param Project $project
     * @return ProviderRepositoryInterface
     */
    protected function getRepositoryManager(Project $project)
    {
        $providerOauth = ProviderOauthFactory::create($project->provider->friendly_name);

        $oauth = new ProviderOauthManager;
        $oauth->setProvider($providerOauth);
        $oauth->setUser($project->user);

        $providerRepository = new ProviderRepositoryManager();
        
        return $providerRepository->driver($project->provider->friendly_name, $oauth->getAccessToken());

    }
}
