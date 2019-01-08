<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class DeployAccessToken extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deploy_access_tokens';

    /**
     * @var bool
     */
    public $incrementing = false;

    /**
     * @var array
     */
    public $fillable = [
        'id',
        'user_id',
        'provider_id',
        'scopes',
        'revoked',
        'expires_at',
        'token_type',
    ];

    /**
     * Return deploy access token data for Bitbucket.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function refreshToken()
    {
        return $this->hasOne('Deploy\Models\DeployRefreshToken', 'deploy_access_token_id')->first();
    }

    /**
     * Belongs to one provider.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function provider()
    {
        return $this->belongsTo('Deploy\Models\Provider');
    }
}
