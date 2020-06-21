<?php

namespace Deploy\Tests\Unit;

use Deploy\Environment\EnvironmentEncrypter;
use Illuminate\Contracts\Config\Repository;
use Mockery;
use PHPUnit\Framework\TestCase;

class EnvironmentEncrypterTest extends TestCase
{
    public function test_encrypt()
    {
        $config = Mockery::mock(Repository::class);
        $config->shouldReceive('get')->with('app.cipher')->andReturn('AES-256-CBC');

        $password = 'foo';

        $encrypter = new EnvironmentEncrypter($config);
        $encrypter->setKey($password);

        $encrypterString = $encrypter->encrypt('FOO=BAR');

        $this->assertNotEquals('FOO=BAR', $encrypterString);
        $this->assertEquals('FOO=BAR', $encrypter->decrypt($encrypterString));
    }
}
