/*
* Create and export configuration
*/


// Container for all environments
var env = {};

// staging (default) envitonment

env.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'Secret',
};

// production environments
env.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'Secret'
};

// Deter which environment is exported as a CLA

var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

var exportEnv = typeof(env[currentEnv]) == 'object' ? env[currentEnv] : env.staging;

//export module

module.exports = exportEnv;
