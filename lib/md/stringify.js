var EOL = require('os').EOL;
var Renderer = require('./renderer');
var TextRenderer = require('./text');
var Parser = require('./parser');
var ref = require('../util/links').ref;

/**
 *  @func stringify(tokens, [modifiers])
 *
 *  @api private
 *
 *  Converts the lexer tokens back to a markdown string.
 *
 *  @param tokens The lexer tokens.
 *  @param renderer The renderer instance to use.
 */
function stringify(tokens, renderer) {
  renderer = renderer || new Renderer;
  var parser = new Parser({renderer: renderer});
  var md =  parser.parse(tokens);
  for(var z in tokens.links) {
    md += ref(z, tokens.links[z].href) + EOL;
  }
  return md;
}

module.exports = stringify;
