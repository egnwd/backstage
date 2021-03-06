---
'@backstage/plugin-catalog-backend': minor
---

Add `readonly` mode to catalog backend

This change adds a `catalog.readonly` field in `app-config.yaml` that can be used to configure the catalog in readonly mode which effectively disables the possibility of adding new components to the catalog after startup.

When in `readonly` mode only locations configured in `catalog.locations` are loaded and served.
By default `readonly` is disabled which represents the current functionality where locations can be added at run-time.

This change requires the config API in the router which requires a change to `createRouter`.

```diff
   return await createRouter({
     entitiesCatalog,
     locationsCatalog,
     higherOrderOperation,
     locationAnalyzer,
     logger: env.logger,
+    config: env.config,
   });
```
