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
}
