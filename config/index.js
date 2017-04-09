'use strict';

let config = {
  user: 'admin', //env var: PGUSER
  database: 'store', //env var: PGDATABASE
  password: 'admin', //env var: PGPASSWORD
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

// ----------------------------------------------------
// Assign values based on current execution environment
// ----------------------------------------------------
let environmentSettings = {};
switch (process.env.NODE_ENV) {
  case 'production': environmentSettings = require('./env-prod'); break;
  case 'test': environmentSettings = require('./env-test'); break;
  default: environmentSettings = require('./env-dev'); break;
}
config = Object.assign(config, environmentSettings);

// Export final configuration object
module.exports = config;
