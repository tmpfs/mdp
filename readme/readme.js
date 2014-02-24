/**
 *  This a mock file to illustrate that documents
 *  may be built from objects defined in modules as
 *  well as json definitions.
 *
 *  This just defers to the package.json descriptor.
 */
module.exports = function() {
  return require('../package.json');
}
