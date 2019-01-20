# Deploy

<p align="center">
    <a href="https://travis-ci.org/itsjeffro/deploy"><img src="https://travis-ci.org/itsjeffro/deploy.svg?branch=master" alt="Build Status"></a>
    <a href="https://packagist.org/packages/itsjeffro/deploy"><img src="https://poser.pugx.org/itsjeffro/deploy/license.svg"></a>
</p>

## Introduction
Deploy provides a dasboard for existing Laravel applications to manage zero-downtime deployments.

<p align="center">
    <img src="https://res.cloudinary.com/dz4tjswiv/image/upload/v1547982989/deploy.png">
</p>

## Installation
Prior to installing this package, it is assumed you have already configured an auth gaurd with the App\User model for your Laravel application. 

Using composer, install the package into your Laravel project:
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
you to setup the repository providers, path and SSH settings.

## Available Providers

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

## Queue
In order to properly utilise the deployment functionality of the package. In your .env file, it is recommended to 
update your queue driver to something other than "sync". This way the process worker can correctly access the 
known_hosts file belonging to the server's user. 

Example /home/user/.ssh/known_hosts will be used instead of /var/www/.ssh/known_hosts

## Broadcasting
To allow real-time feedback when a deployment or server connection has started or finished, you may set up the application 
to utlise Laravel's broadcasting feature.

The routes are already configured, you will just need to update your .env file with the provider and credentials. You may also need to restart the queue worker 
to pick up on your configuration updates.

## Deployments
Given that the deployment process uses symlinks. The user performing the deployment actions will be required to have the abity to reload the php-fpm service on the server.

## Deployment Hooks
Deployment hooks provide the user the ability to perform extra tasks along side the default actions:

- Clone New Release
- Activate New Release
- Clean Up

### Available Variables
| Variable | Example Output | Description |
|----------|----------------|-------------|
| {{ project }} | /var/www/html | Absolute path to project. |
| {{ releases }} | /var/www/html/releases | Absolute path to releases. |
| {{ release }} | /var/www/html/releases/20190120104650 | Absolute path to new release. |
| {{ time }} | 20190120104650 | Generated date time prior to deployment. Format YmdHis |
