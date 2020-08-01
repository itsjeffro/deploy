<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Route Prefix
    |--------------------------------------------------------------------------
    */

    'path' => 'deploy',
    
    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    */

    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | SSH Key
    |--------------------------------------------------------------------------
    |
    | This provides the app the ability to generate keys and provide keys
    | to ssh into a server. Given that the target server has added
    | the generated public key to their authorized_keys file.
    |
    */

    'ssh_key' => [

        'path' => 'keys',
        'bit' => 4096,
        'comment' => 'deploy@domain.com',

    ],

    /*
    |--------------------------------------------------------------------------
    | SSH Multiplexing
    |--------------------------------------------------------------------------
    |
    | By setting SSH multiplexing to true, will allow for
    | multiple sessions over a single TCP connection.
    |
    */

    'ssh_multiplexing' => env('SSH_MULTIPLEXING', false),

    /*
    |--------------------------------------------------------------------------
    | Providers
    |--------------------------------------------------------------------------
    |
    | Here you may define all the repository providers available to
    | integrate in a deployment project. Once defined, a provider
    | will automatically be available for a user to select.
    |
    */

    'providers' => [

        'bitbucket' => [
            'oauth'         => Deploy\ProviderOauth\Bitbucket\BitbucketOauth::class,
            'repository'    => Deploy\ProviderRepository\Bitbucket\Bitbucket::class,
            'key'           => env('BITBUCKET_OAUTH_KEY', ''),
            'secret'        => env('BITBUCKET_OAUTH_SECRET', ''),
        ],

        'github' => [
            'oauth'         => Deploy\ProviderOauth\Github\GithubOauth::class,
            'repository'    => Deploy\ProviderRepository\Github\Github::class,
            'key'           => env('GITHUB_OAUTH_KEY', ''),
            'secret'        => env('GITHUB_OAUTH_SECRET', ''),
        ]

    ],

    /*
    |--------------------------------------------------------------------------
    | Models
    |--------------------------------------------------------------------------
    |
    | Application specific models.
    |
    */

    'models' => [

        'user' => \App\User::class,

    ],

];
