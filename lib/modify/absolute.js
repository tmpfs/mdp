var abs = require('../links').abs;
var isAbsolute = require('../links').isAbsolute;
var anchor = require('../links').anchor;

/**
 *  @func links(token)
 *
 *  @api private
 *
 *  Modifies links links to be absolute.
 *
 *  @param The meta data.
 */
module.exports = function links(meta) {
  if(!meta.base) return;
  return function (token) {
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      var re = /\[([^\]]+)\]\(([^)]*)\)/g, result, text, href, start, end;
      while(result = re.exec(token.text)) {
        text = result[1]; href = result[2];
        if(isAbsolute(href)) continue;
        href = abs(href, meta);
        start = token.text.substr(0, result.index);
        end = token.text.substr(result.index + result[0].length);
        token.text = start + anchor(text, href) + end;
      }
    }
  }
}
