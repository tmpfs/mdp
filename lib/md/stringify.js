var EOL = require('os').EOL;
var Renderer = require('./renderer');
var Parser = require('./parser');
var ref = require('../links').ref;

/**
 *  @func stringify(tokens, [modifiers])
 *
 *  @api private
 *
 *  Converts the lexer tokens back to a markdown string.
 *
 *  @param tokens The lexer tokens.
 */
function stringify(tokens) {
  var parser = new Parser({renderer: new Renderer});
  var md =  parser.parse(tokens);
  for(var z in tokens.links) {
    md += ref(z, tokens.links[z].href) + EOL;
  }
  return md;
}

module.exports = stringify;
