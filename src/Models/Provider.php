<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    /**
     * Bitbucket provider name.
     *
     * @var string
     */
    const BITBUCKET_PROVIDER = 'bitbucket';

    /**
     * Github provider name.
     *
     * @var string
     */
    const GITHUB_PROVIDER = 'github';

   /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'providers';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;
    
    /**
     * Return the latest access token associated with a provider.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function deployAccessToken()
    {
        return $this->hasOne('Deploy\Models\DeployAccessToken', 'provider_id')->latest();
    }
}
