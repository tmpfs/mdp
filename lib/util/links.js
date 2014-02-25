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
 *  @func hash(token, base)
 *
 *  @param token The lexer token.
 *  @param base A base url to prefix to the href.
 *
 *  @return A string url.
 */
function hash(token, base) {
  var text = token.text;
  text = gfm(text);
  return (base || '') + '#' + text;
}

function isHash(href) {
  return /^#/.test(href);
}

function gfm(text) {
  text = text.toLowerCase();
  return text.replace(/[^A-Z0-9a-z -]/g, '').replace(' ', '-');
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
function link(token, meta) {
  var text = token.text;
  if(!meta.base || !meta.hash) return anchor(text, '#' + gfm(text));
  var href = hash(token, base);
  return anchor(text, href);
}

function anchor(text, href, title) {
  return '[' + text + '](' + href + ')';
}

function ref(text, href, title) {
    // TODO: handle link titles
  return '[' + text + ']: ' + href;
}

module.exports = {
  abs: abs,
  anchor: anchor,
  isAbsolute: isAbsolute,
  isHash: isHash,
  link: link,
  ref: ref
}
