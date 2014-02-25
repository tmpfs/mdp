var abs = require('./links').abs;
//var isHash = require('./links').isHash;

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
    //if(!meta.hash && isHash(links[z].href)) continue;
    links[z].href = abs(links[z].href, meta);
  }
}
