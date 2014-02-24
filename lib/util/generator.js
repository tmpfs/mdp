//var stringify = require('./stringify');
var defaults = require('../defaults');

/**
 *  @func generator(meta)
 *
 *  Retrieve a generator section.
 */
function generator(meta) {
  return [{type: 'paragraph', text: defaults.generator}];
}

module.exports = generator;
