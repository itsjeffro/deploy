# Deployment hooks

Deployment hooks provide the user the ability to perform extra tasks along side the default actions:

- Clone New Release
- Activate New Release
- Clean Up

## Available Variables

| Variable | Example Output | Description |
|----------|----------------|-------------|
| {{ project }} | /var/www/html | Absolute path to project. |
| {{ releases }} | /var/www/html/releases | Absolute path to releases. |
| {{ release }} | /var/www/html/releases/20190120104650 | Absolute path to new release. |
| {{ time }} | 20190120104650 | Generated date time prior to deployment. Format YmdHis |
