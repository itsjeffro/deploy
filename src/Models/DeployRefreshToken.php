<?php

namespace Deploy\Models;

use Illuminate\Database\Eloquent\Model;

class DeployRefreshToken extends Model
{
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
    public $fillable = [
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
}

