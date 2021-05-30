<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeployAccessToken extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deploy_access_tokens';

    /**
     * @var boolean
     */
    public $incrementing = false;

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * @var array
     */
    protected $fillable = [
        'id',
        'user_id',
        'provider_id',
        'scopes',
        'revoked',
        'expires_at',
        'token_type',
    ];

    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function newFactory()
    {
        return \Database\Factories\DeployAccessTokenFactory::new();
    }

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
