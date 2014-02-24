var stringify = require('./stringify');
var defaults = require('./defaults');

/**
 *  @func generator(meta)
 *
 *  Retrieve a generator section.
 */
function generator(meta) {
  var text = meta.generator;
  var parts = [];
  console.log('get generator parts');
  //parts.push({type: 'heading', text: 'Generator', depth: 2});
  parts.push({type: 'paragraph', text: defaults.generator});
  return parts;
}

module.exports = function(meta) {
  return stringify([generator(meta)]);
}

module.exports.tok = generator;
