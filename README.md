# Deploy

## Introduction
Deploy provides zero-downtime deployment for existing Laravel applications.

## Installation
Include the repository link within your composer.json and run composer to install the package:
```
composer install
```

Publish the package's assets:
```
php artisan vendor:publish --tags=deploy-config
```

Run the package's migrations
```
php artisan migrate
```

### Configuration
After publishing the assets, the primary config file will be located in config/deploy.php. This configuration file allows
you to setup the providers (Github and/or Bitbucket) and SSH settings.