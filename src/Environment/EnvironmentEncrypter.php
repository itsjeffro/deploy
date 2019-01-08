<?php

namespace Deploy\Environment;

use Illuminate\Encryption\Encrypter;

class EnvironmentEncrypter
{
    /**
     * @var \Illuminate\Encryption\Encrypter
     */
    public $encrypter;

    /**
     * Instantiate EnvironmentEncrypter.
     *
     * @param string $key
     *
     * @return \Illuminate\Encryption\Encrypter
     */
    public function __construct($key)
    {
        $length = mb_strlen($key);
        $remainingLength = 32 - ($length > 0 ? $length : 0);
        $key = str_repeat('0', $remainingLength).$key;

        $this->encrypter = new Encrypter($key, config('app.cipher'));
    }

    /**
     * Encrypt value.
     *
     * @param string $value
     *
     * @return string
     */
    public function encrypt($value)
    {
        return $this->encrypter->encryptString($value);
    }

    /**
     * Decrypt value.
     *
     * @param string $value
     *
     * @return string
     */
    public function decrypt($value)
    {
        return $this->encrypter->decryptString($value);
    }
}
