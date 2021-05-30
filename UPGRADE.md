# Upgrade Guide

Always ensure you run the following commands when upgrading.

```bash
php artisan vendor:publish --tag=deploy-assets --force
```

```bash
php artisan migrate
```

```bash
php artisan queue:restart
```

## Upgrading To 3.0 From 2.x

### Minimum PHP Version

PHP 7.3 is now the minimum required version.

### Minimum Laravel Version

Laravel 8.0 is now the minimum required version.
