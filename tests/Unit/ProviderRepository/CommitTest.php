<?php

namespace Deploy\Tests\Unit\ProviderRepository;

use PHPUnit\Framework\TestCase;
use Deploy\ProviderRepository\Commit;
use Deploy\ProviderRepository\Reference;

class CommitTest extends TestCase
{
    public function test_returns_commit_hash()
    {
        $tagName = 'v1.0';
        $tags = [
            ['name' => 'v1.0', 'commit' => 'abc123'],
        ];

        $commit = new Commit(Reference::TAG_TYPE, $tagName);
        
        $this->assertEquals('abc123', $commit->getCommitHashFromtag($tags, $tagName));
    }

    public function test_tag_does_not_exist_in_list()
    {
        $this->expectException(\InvalidArgumentException::class);

        $commit = new Commit(Reference::TAG_TYPE, 'v1.0');
        
        $commit->getCommitHashFromtag([], 'v1.0');
    }
}
