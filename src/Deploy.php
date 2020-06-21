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
        $messages = new DeployMessages(config());

        return [
            'warnings' => $messages->getWarnings(),
            'url' => config('app.url'),
            'path' => config('deploy.path'),
            'timezone' => config('app.timezone'),
            'broadcasting' => [
                'is_enabled' => config('broadcasting.default') !== 'log',
                'key' => config('broadcasting.connections.pusher.key'),
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ],
        ];
    }
}
