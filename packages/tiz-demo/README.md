# Tiz

## config

- normal config, `normal.js / json / yaml / yml`, results `app.config.normal`
- env config: `default / development / xxx`, results direct to `app.config`

## app
link to `node_modules/app`

### routes.js / policy.js / controllers / policies

like sails, 由 impress-router-table 实现

### services

- `require('app/services/TestService.js')`
- global `TestService`

### models

- `models/wa_test.js` become model `WaTest`
- `models/connname/test.js` become model `Test` and using connection `connname`