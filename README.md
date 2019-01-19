# Deploy

<p align="center">
    <a href="https://travis-ci.org/itsjeffro/deploy"><img src="https://travis-ci.org/itsjeffro/deploy.svg?branch=master" alt="Build Status"></a>
    <a href="https://packagist.org/packages/itsjeffro/deploy"><img src="https://poser.pugx.org/itsjeffro/deploy/license.svg"></a>
</p>

## Introduction
Deploy provides zero-downtime deployment for existing Laravel applications.

Note: The deployment process uses symlinks and will require the user to be able to reload the php service.

## Installation
Use composer to install the package into your Laravel project:
```
composer require itsjeffro/deploy
```

Next, you will need to register the package's service provider class under the providers array 
in the config/app.php configuration file.

```
Deploy\DeployServiceProvider::class
```

Publish the package's config and assets:
```
php artisan vendor:publish --tag=deploy-config
php artisan vendor:publish --tag=deploy-assets
```

Run the package's migrations:
```
php artisan migrate
```

### Configuration
After publishing the assets, the primary config file will be located in config/deploy.php. This configuration file allows
you to setup the providers (Github and/or Bitbucket) and SSH settings.

The following providers are available:

- Bitbucket
- Github

You may update your .env file to include the following:

__Bitbucket__

https://confluence.atlassian.com/bitbucket/oauth-on-bitbucket-cloud-238027431.html
```bash
BITBUCKET_OAUTH_KEY=client_id
BITBUCKET_OAUTH_SECRET=client_secret
```
__Github__

https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/
```bash
GITHUB_OAUTH_KEY=client_id
GITHUB_OAUTH_SECRET=client_secret
```

### Queue
In order to properly utilise the deployment functionality of the package. In your .env file, it is recommended to 
update your queue driver to something other than "sync". This way the process worker can correctly access the 
known_hosts file belonging to the server's user. 

Example /home/user/.ssh/known_hosts will be used instead of /var/www/.ssh/known_hosts

### Broadcasting
To allow real-time feedback when a deplpoyment or server connwction has started or finished, you may set up the application 
to utlise Laravel's  broadcasting feature.

The routes are already configured, you will just need to update your .env file. You may also need to restart the queue worker 
to pick up on your configuration updates.