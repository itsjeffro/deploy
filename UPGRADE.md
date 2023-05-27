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

## Upgrading To 4.0 From 3.x

### Minimum PHP Version

PHP 8.1 is now the minimum required version.

### Minimum Laravel Version

Laravel 10 is now the minimum required version.
