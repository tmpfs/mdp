var defaults = require('../defaults');
var markzero = require('../md');
var tokens = markzero.tokens;

/**
 *  @func generator(meta)
 *
 *  Retrieve a generator section.
 */
function generator(meta) {
  return [tokens.paragraph(defaults.generator)];
}

module.exports = generator;
