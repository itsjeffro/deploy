<?php

namespace Deploy\Ssh;

use phpseclib3\Crypt\RSA;
use phpseclib3\Crypt\RSA\PrivateKey;

class Key
{
    /** @var int */
    public const PRIVATE_KEY_CHMOD = 0600;

    public function __construct(private PrivateKey $key)
    {}

    public static function make(?string $comment = null, int $bit = 4096): self
    {
        $rsa = RSA::createKey($bit);

        if ($comment) {
            $rsa->withLabel($comment);
        }
        
        return new static($rsa);
    }

    public function getPublicKey(): string
    {
        return $this->key->getPublicKey()->toString('OpenSSH');
    }

    public function getPrivateKey(): string
    {
        return $this->key->toString('PKCS1');
    }
}
