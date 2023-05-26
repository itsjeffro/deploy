<?php

namespace Deploy\Tests\Unit\Ssh;

use Deploy\Ssh\Key;
use PHPUnit\Framework\TestCase;

class KeyTest extends TestCase
{
    public function test_generate(): void
    {
        $rsa = Key::make('key-comment');

        $publicKey = $rsa->publicKey();
        $privateKey = $rsa->privateKey();

        $this->assertStringContainsString('ssh-rsa' , $publicKey);
        $this->assertStringContainsString('-----BEGIN RSA PRIVATE KEY-----' , $privateKey);
    }
}
