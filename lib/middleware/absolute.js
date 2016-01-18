var markzero = require('markzero');
var abs = markzero.links.abs;
var isAbsolute = markzero.links.isAbsolute;
var isHash = markzero.links.isHash;
var anchor = markzero.links.anchor;

/**
 *  @func absolute(token)
 *
 *  @api private
 *
 *  Modifies URLs to be absolute within inline text blocks.
 *
 *  @param The meta data.
 */
module.exports = function middleware(meta) {
  if(!meta.base) {
    return;
  }
  return function absolute(token, tokens, next) {
    if(!arguments.length) {
      return;
    }
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      var re = /\[([^\]]+)\]\(([^)]*)\)/g, result, text, href, start, end;
      while((result = re.exec(token.text))) {
        text = result[1]; href = result[2];
        if(!meta.hash && isHash(href)) {
          continue;
        }
        if(isAbsolute(href)) {
          continue;
        }
        href = abs(href, meta);
        start = token.text.substr(0, result.index);
        end = token.text.substr(result.index + result[0].length);
        token.text = start + anchor(text, href) + end;
      }
    }
    next();
  }
}
