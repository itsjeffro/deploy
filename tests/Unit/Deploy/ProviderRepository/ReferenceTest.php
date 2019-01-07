<?php

namespace Deploy\Tests\Unit\ProviderRepository;

use PHPUnit\Framework\TestCase;
use Deploy\ProviderRepository\Reference;

class ReferenceTest extends TestCase
{
    public function test_reference_types()
    {
        $referenceBranch = new Reference(Reference::BRANCH_TYPE, 'master');
        $referenceCommit = new Reference(Reference::COMMIT_TYPE, 'abc0123');
        $referenceTag = new Reference(Reference::TAG_TYPE, 'v1.0');

        $this->assertEquals($referenceBranch->getReference(), Reference::BRANCH_TYPE);
        $this->assertEquals($referenceCommit->getReference(), Reference::COMMIT_TYPE);
        $this->assertEquals($referenceTag->getReference(), Reference::TAG_TYPE);
    }

    public function testInvalidReferenceType()
    {
        $this->expectException(\InvalidArgumentException::class);

        $reference = new Reference('invalid_type', 'master');
        $reference->getReference();
    }
}
