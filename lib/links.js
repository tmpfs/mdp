function isAbsolute(href) {
  return /^[a-z0-9A-Z]+:\/\//.test(href)
}

/**
 *  @func (links, base)
 *
 *  @api private
 *
 *  @param links The map of link tokens.
 */
function absolute(links, base) {
  function abs(href, base) {
    if(isAbsolute(href)) return href;
    return base + href;
  }
  for(var z in links) {
    links[z].href = abs(links[z].href, base);
  }
}

/**
 *  @func inline(token)
 *
 *  @api private
 *
 *  Modifies inline links to be absolute.
 *
 *  @param The Lexer token.
 */
function inline(token) {
  if(token.text && token.type === 'paragraph') {
    var re = /\[([^\]]+)\]\(([^)]*)\)/g;
    if(re.test(token.text)) {
      // TODO: implement replacement
      //console.log('GOT INLINE LINK %j', token.text);
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
  return '[' + text + '](' + href + ')';
}

module.exports = {
  inline: inline,
  absolute: absolute,
  link: link
}
