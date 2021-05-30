<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeployRefreshToken extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'deploy_refresh_tokens';

    /**
     * @var boolean
     */
    public $incrementing = false;
    
    /**
     * @var array
     */
    protected $fillable = [
        'id', 
        'deploy_access_token_id',
        'revoked',
        'expires_at',
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get a new factory instance for the model.
     *
     * @param  mixed  $parameters
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public static function newFactory()
    {
        return \Database\Factories\DeployRefreshTokenFactory::new();
    }

}

