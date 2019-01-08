<?php

namespace Deploy\Tests\Unit\ProviderRepository;

use Deploy\ProviderRepository\Commit;
use Deploy\ProviderRepository\Reference;
use PHPUnit\Framework\TestCase;

class CommitTest extends TestCase
{
    public function testReturnsCommitHashFromMatchingTag()
    {
        $tagName = 'v1.0';
        $tags = [
            ['name' => 'v1.0', 'commit' => 'abc123'],
        ];

        $commit = new Commit(Reference::TAG_TYPE, $tagName);

        $this->assertEquals('abc123', $commit->getCommitHashFromtag($tags, $tagName));
    }
}
