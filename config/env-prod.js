'use strict';

// Production environment settings
let config = {};

// Pull in production RDS configuration
config.user = process.env.RDS_USERNAME;
config.database = process.env.RDS_DB_NAME;
config.password = process.env.RDS_PASSWORD;
config.hostname = process.env.RDS_HOSTNAME;
config.port = process.env.RDS_PORT;

module.exports = config;
