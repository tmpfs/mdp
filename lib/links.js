function isAbsolute(href) {
  return /^[a-z0-9A-Z]+:\/\//.test(href)
}

function abs(href, meta) {
  if(isAbsolute(href)) return href;
  var base = '' + meta.base;
  base = base.replace(/\/+$/, '');
  // github uses / to denote /blob/{branch}
  // respected if gfm is true
  if(/^\//.test(href) && meta.gfm) {
    base += '/blob/' + (meta.branch || 'master');
  }
  return base + href;
}

/**
 *  @func (links, base)
 *
 *  @api private
 *
 *  @param links The map of link tokens.
 */
function absolute(meta, links) {
  if(!meta.base) return;
  for(var z in links) {
    links[z].href = abs(links[z].href, meta);
  }
}

/**
 *  @func inline(token)
 *
 *  @api private
 *
 *  Modifies inline links to be absolute.
 *
 *  @param The meta data.
 */
function inline(meta) {
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

/**
 *  @func hash(token, base)
 *
 *  @param token The lexer token.
 *  @param base A base url to prefix to the href.
 *
 *  @return A string url.
 */
function hash(token, base) {
  var text = token.text;
  text = text.toLowerCase();
  text = text.replace(/[^A-Z0-9a-z -]/g, '').replace(' ', '-');
  return (base || '') + '#' + text;
}

/**
 *  @func link(token, base)
 *
 *  Create a toc link.
 *
 *  @param token The lexer token.
 *  @param base A base url to prefix to the href.
 *
 *  @return The token text wrapped in a link.
 */
function link(token, base) {
  var text = token.text;
  var href = hash(token, base);
  return anchor(text, href);
}

function anchor(text, href, title) {
  return '[' + text + '](' + href + ')';
}

module.exports = {
  inline: inline,
  absolute: absolute,
  link: link,
  stringify: anchor
}
