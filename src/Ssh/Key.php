<?php

namespace Deploy\Ssh;

use phpseclib\Crypt\RSA;
use Exception;

class Key
{
    /**
     * Generate key pair.
     *
     * @param string $storagePath
     * @param string $keyName
     * @param string $comment
     * @param integer $bit
     * @return string
     */
    public function generate($storagePath, $keyName = 'id_rsa', $comment = null, $bit = 4096)
    {
        $rsa = new RSA;
        $rsa->setPublicKeyFormat(RSA::PUBLIC_FORMAT_OPENSSH);

        if ($comment) {
            $rsa->setComment($comment);
        }
        
        $keys = $rsa->createKey($bit);

        $privateKey = $storagePath . '/' . $keyName;
        $publicKey = $storagePath . '/' . $keyName . '.pub';

        if (file_exists($privateKey) || file_exists($publicKey)) {
            throw new Exception('Keys already exist in path.');
        }
        
        file_put_contents($privateKey, $keys['privatekey']);
        file_put_contents($publicKey, $keys['publickey']);
        
        return 'Successfully generated keys.';
    }
}