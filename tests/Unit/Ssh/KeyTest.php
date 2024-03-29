<?php

namespace Deploy\Tests\Unit\Ssh;

use Deploy\Ssh\Key;
use PHPUnit\Framework\TestCase;

class KeyTest extends TestCase
{
    public function test_generate(): void
    {
        $rsa = Key::make('public-key-comment');

        $publicKey = $rsa->getPublicKey();
        $privateKey = $rsa->getPrivateKey();

        $this->assertStringContainsString('ssh-rsa' , $publicKey);
        $this->assertStringContainsString('public-key-comment' , $publicKey);
        $this->assertStringContainsString('-----BEGIN RSA PRIVATE KEY-----' , $privateKey);
    }
}
