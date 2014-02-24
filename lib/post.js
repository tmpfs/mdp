var marked = require('marked');
var utils = require('cli-util');
var repeat = utils.repeat;

var stringify = require('./stringify');
var header = require('./header').tok;

/**
 *  @func modify(tokens, [modifiers])
 *
 *  @api private
 *
 *  Modifies the token list.
 *
 *  @param tokens The lexer tokens.
 *  @param modifiers An array of modifier functions.
 */
function modify(tokens, modifiers) {
  modifiers = modifiers || [];
  function modify(token, tokens) {
    modifiers.forEach(function(func) {
      func(token, tokens);
    });
  }
  for(var i = 0;i < tokens.length;i++) {
    modify(tokens[i], tokens);
  }
}

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

/**
 *  @func toc(meta)
 *
 *  @api private
 *
 *  Creates tokens for the table of contents.
 *
 *  @param meta The generator meta data.
 *  @param toc An array to add toc tokens to.
 *  @param base A base url.
 *  @param title A title for the toc.
 *
 *  @return A closure that modifies the toc tokens array.
 */
function toc(meta, toc, base, title) {
  var depth = 0, current;
  if(title && typeof title === 'string') {
    toc.push(header(title));
  }
  return function(token, tokens) {
    function end(flag) {
      toc.push({type: 'list_end', toc: flag});
      //console.log('end list %s', current.text);
    }
    if(token.type === 'heading') {
      //console.log('depth: %s, token.depth: %s', depth, token.depth);
      if(token.depth !== depth) {
        if(current) end(true);
        current = token;
        //console.log('start list %s', token.text);
        toc.push(
          {type: 'list_start', ordered: false});
      }
      //console.log('add toc item %s', token.text);
      toc.push({type: 'list_item_start', indent: token.depth - 1});
      toc.push({type: 'text', text: link(token, base)});
      toc.push({type: 'list_item_end'});
      depth = token.depth;
    }
    if(token === tokens[tokens.length - 1]) end(false);
  }
}

/**
 *  @func (meta, markdown, callback)
 *
 *  Post process the generated markdown document.
 *
 *  @param meta The meta data.
 *  @param markdown The markdown document.
 *  @param callback A callback function.
 */
module.exports = function post(meta, markdown, callback) {
  var lexer = new marked.Lexer(meta.marked);
  var base = meta && meta.base ?
    meta.base : meta.base;
  var usetoc = meta && meta.toc ?
    meta.toc : meta.toc;
  if(!base && !usetoc) return callback(
    null, {markdown: markdown, tokens: lexer.lex(markdown)});
  // list of tokens for the table of contents
  var toctok = [];
  var tokens = lexer.lex(markdown);
  // make links absolute
  var links = tokens.links;
  absolute(links, base);
  var modifiers = [];
  if(usetoc) modifiers.push(toc(meta, toctok, base, usetoc));
  if(base) modifiers.push(inline);
  modify(tokens, modifiers);
  tokens = toctok.concat(tokens);
  tokens.links = links;
  markdown = stringify(tokens);
  callback(null, {markdown: markdown, tokens: tokens});
}
