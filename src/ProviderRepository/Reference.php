<?php

namespace Deploy\ProviderRepository;

use InvalidArgumentException;

class Reference
{
    /**
     * Repository reference branch type.
     *
     * @var string
     */
    const BRANCH_TYPE = 'branch';

    /**
     * Repository reference commit type.
     *
     * @var string
     */
    const COMMIT_TYPE = 'commit';

    /**
     * Repository reference tag type.
     *
     * @var string
     */
    const TAG_TYPE = 'tag';

    /**
     * Currently set reference type, eg. "commit", "branch" or "tag".
     *
     * @var string
     */
    public $reference;

    /**
     * Currently set reference id, eg. commit hash, branch name or tag name.
     *
     * @var string
     */
    public $id;

    /**
     * Instantiate.
     *
     * @param string $reference
     * @param string $id
     */
    public function __construct($reference, $id)
    {
        $this->setReference($reference);
        $this->setId($id);
    }

    /**
     * Set reference type.
     *
     * @param  string $reference
     * @return string
     * @throws InvalidArgumentException
     */
    public function setReference($reference)
    {
        if ($reference === self::BRANCH_TYPE) {
            $this->reference = self::BRANCH_TYPE;
        } elseif ($reference === self::COMMIT_TYPE) {
            $this->reference = self::COMMIT_TYPE;
        } elseif ($reference === self::TAG_TYPE) {
            $this->reference = self::TAG_TYPE;
        } else {
            throw new InvalidArgumentException('The following [' . $reference . '] is not a valid reference type.');
        }
    }

    /**
     * Get reference type.
     *
     * @return string
     */
    public function getReference()
    {
        return $this->reference;
    }

    /**
     * Set reference id.
     *
     * @param  string $id
     * @return void
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Get reference id (branch name, tag name or commit sha).
     *
     * @return string
     */
    public function getId()
    {
        return $this->id;
    }
}
