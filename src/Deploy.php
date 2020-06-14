<?php

namespace Deploy;

class Deploy
{
    /**
     * Default configuration for the Javascript application.
     *
     * @return array
     */
    public static function scriptVariables()
    {
        return [
            'url' => config('app.url'),
            'path' => config('deploy.path'),
            'timezone' => config('app.timezone'),
            'broadcasting' => [
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ],
        ];
    }
}
