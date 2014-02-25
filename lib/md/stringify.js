var EOL = require('os').EOL;
var marked = require('marked');
var Renderer = require('./renderer');
var TextRenderer = require('./text');
var ManualRenderer = require('./man');
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
function stringify(tokens, renderer, suppress) {
  renderer = renderer || new Renderer;

  // do not mangle links for these renderer types
  if((renderer instanceof TextRenderer)
    || (renderer instanceof ManualRenderer)) {
    marked.InlineLexer.prototype.mangle = function(text){return text};
  }

  var parser = new Parser({renderer: renderer});
  var md =  parser.parse(tokens);
  if(!suppress) {
    for(var z in tokens.links) {
      md += ref(z, tokens.links[z].href) + EOL;
    }
  }
  return md;
}

module.exports = stringify;
