# Folder structure

During the first deployment, a few directories (current, releases) will be created. With the combination of symlinks, will allow for zero-downtime deployments. For each successful deployment, a new release directory will be created and the "current" link will be updated to point to the new release.

```
- current (symlink) -> 20190102235900
- releases
    - 20190102235900
    - 20190101235900
```