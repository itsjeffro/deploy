<?php

namespace Deploy\Contracts\ProviderRepository;

interface ProviderRepositoryInterface
{
    /**
     * Return api root url.
     *
     * @return string
     */
    public function getApiUrl();

    /**
     * Get repository branch.
     *
     * @param string $userRepo
     * @param string $branch
     *
     * @return array
     */
    public function branch($userRepo, $branch);

    /**
     * Get repository branches.
     *
     * @param string $userRepo
     *
     * @return array
     */
    public function branches($userRepo);

    /**
     * Get repository commit.
     *
     * @param string $userRepo
     * @param string $node
     *
     * @return array
     */
    public function commit($userRepo, $node);

    /**
     * Get commits from branch.
     *
     * @param string $userRepo
     * @param string $branch
     *
     * @return array
     */
    public function commits($userRepo, $branch = '');

    /**
     * Get repository information.
     *
     * @param string $userRepo
     *
     * @return array
     */
    public function repository($userRepo);

    /**
     * Get tags from repository.
     *
     * @param string $userRepo
     *
     * @return array
     */
    public function tags($userRepo);
}
