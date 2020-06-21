<?php

namespace Deploy\Environment;

use Illuminate\Contracts\Config\Repository;
use Illuminate\Encryption\Encrypter;

class EnvironmentEncrypter
{
    /** @var Encrypter */
    public $encrypter;

    /** @var string */
    private $cipher;

    /** @var string */
    private $key;

    /**
     * Instantiate EnvironmentEncrypter.
     *
     * @return Encrypter
     */
    public function __construct(Repository $config)
    {
        $this->cipher = $config->get('app.cipher');
    }

    /**
     * Set the key to encrypt and decrypt the env contents.
     *
     * @param string $key
     * @return self
     */
    public function setKey(string $key)
    {
        $length = mb_strlen($key);
        $remainingLength = 32 - ($length > 0 ? $length : 0);
        $key = str_repeat('0', $remainingLength) . $key;

        $this->key = $key;

        return $this;
    }

    /**
     * Encrypt env contents.
     *
     * @param string $value
     * @return string
     */
    public function encrypt(string $value): string
    {
        $encrypter = new Encrypter($this->key, $this->cipher);

        return $encrypter->encryptString($value);
    }

    /**
     * Decrypt env contents.
     *
     * @param string $value
     * @return string
     */
    public function decrypt(string $value): string
    {
        $encrypter = new Encrypter($this->key, $this->cipher);

        return $encrypter->decryptString($value);
    }
}
