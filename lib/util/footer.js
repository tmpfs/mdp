var abs = require('./links').abs;

/**
 *  @func footer(meta, links)
 *
 *  @api private
 *
 *  @param links The map of link tokens.
 */
module.exports = function footer(meta, links) {
  if(!meta.base) return;
  for(var z in links) {
    links[z].href = abs(links[z].href, meta);
  }
}
