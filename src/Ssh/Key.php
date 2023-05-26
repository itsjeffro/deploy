<?php

namespace Deploy\Ssh;

use phpseclib3\Crypt\RSA;
use phpseclib3\Crypt\RSA\PrivateKey;

class Key
{
    /** @var int */
    public const PRIVATE_KEY_CHMOD = 0600;

    public function __construct(private PrivateKey $key, private ?string $comment)
    {}

    public static function make(?string $comment = null, int $bit = 4096): self
    {
        $rsa = RSA::createKey($bit);
        
        return new static($rsa, $comment);
    }

    public function getPublicKey(): string
    {
        $options = [];

        if ($this->comment) {
            $options['comment'] = $this->comment;
        }

        return $this->key->getPublicKey()->toString('OpenSSH', $options);
    }

    public function getPrivateKey(): string
    {
        return $this->key->toString('PKCS1');
    }
}
