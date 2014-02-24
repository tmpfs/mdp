/**
 *  This a mock file to illustrate that documents
 *  may be built from objects defined in modules as
 *  well as json definitions.
 *
 *  The module should return either an object configuration or
 *  a function. When the module is a function the return value of
 *  invoking the function is used as the configuration.
 *
 *  This just defers to the package.json descriptor.
 *
 *  You may test this in the context for the repository with:
 *
 *  ./bin/rdm -p readme/readme.js
 */
module.exports = function() {
  return require('../package.json');
}
