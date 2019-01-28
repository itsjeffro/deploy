<?php

namespace Deploy\Ssh;

use phpseclib\Crypt\RSA;

class Key
{
    /**
     * @var integer
     */
    const PRIVATE_KEY_CHMOD = 0600;

    /**
     * Generate key pair contents and return as an array the following associative keys:
     *
     * - publickey
     * - privatekey
     *
     * @param string $keyName
     * @param string $comment
     * @param integer $bit
     * @return array
     */
    public function generate($keyName = 'id_rsa', $comment = null, $bit = 4096)
    {
        $rsa = new RSA;
        $rsa->setPublicKeyFormat(RSA::PUBLIC_FORMAT_OPENSSH);

        if ($comment) {
            $rsa->setComment($comment);
        }
        
        return $rsa->createKey($bit);
    }
}
