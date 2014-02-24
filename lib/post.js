var marked = require('marked');

var utils = require('cli-util');
var repeat = utils.repeat;

// list of tokens for the table of contents
var toctok = [];


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
    modify(tokens[i]);
  }
}

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
  var parts = [];
  var dnl = '\n\n';
  function nl(eol) {
    eol = eol || '\n';
    parts.push(eol);
  }
  var li;
  var links = tokens.links;
  var linked = Object.keys(links).length > 0;
  for(var i = 0;i < tokens.length;i++) {
    token = tokens[i];
    //modify(token);
    switch(token.type) {
      case 'heading':
        if(token.depth == 1) {
          parts.push(token.text);
          nl();
          parts.push(repeat(token.text.length, '='));
        }else{
          parts.push(repeat(token.depth, '#') + ' ' + token.text);
        }
        nl(dnl);
        break;
      case 'code':
        parts.push('```')
        if(token.lang) parts.push(token.lang);
        nl();
        parts.push(token.text);
        nl();
        parts.push('```')
        nl(dnl);
        break;
      case 'list_start':
        li = !token.ordered ? '*' : '1.';
        break;
      case 'list_item_start':
        ++i; token = tokens[i];
        if(token) parts.push(li + ' ' + token.text);
        break;
      case 'list_item_end':
        nl();
        break;
      case 'list_end':
        nl();
        li = null;
        break;
      case 'paragraph':
        parts.push(token.text);
        nl(dnl);
        break;
      default:
        parts.push(token.text);
    }
  }
  if(linked) {
    var z, link;
    for(z in links) {
      link = links[z];
      parts.push('[' + z + ']: ' + link.href);
      nl();
    }
  }
  return parts.join('');
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
 *  @func toc(meta)
 *
 *  @api private
 *
 *  Creates tokens for the table of contents.
 */
function toc(meta, toc) {
  var indent = 0, padding, depth = 0, inlist = false;
  return function(token, tokens) {
    //console.log('check for toc entry: %j', token);
    //console.dir(token);
    function end() {
      toc.push({type: 'list_end'});
      console.log('end list');
    }
    if(token.type === 'heading') {
      //if(token.depth < depth) {
        //inlist = false;
        //end();
      //}
      if(token.depth !== depth) {
        if(inlist && token.depth > 1) end();
        inlist = true;
        console.log('start list');
        toc.push(
          {type: 'list_start', ordered: false});
      }
      depth = token.depth;
      indent = token.depth - 1;
      padding = repeat(indent);
      toc.push({type: 'list_item_start'});
      toc.push({type: 'text', text: token.text});
      //console.log('check for toc entry: %j', token);
      toc.push({type: 'list_item_end'});
      console.dir(token);
      //toc.push(token);
    }
  }
}

/**
 *  @func (meta, markdown, callback)
 *
 *  Post process the resulting markdown document.
 *
 *  This implementation converts links to absolute
 *  if the meta object contains a `base` property.
 *
 *  @param meta The meta data.
 *  @param markdown The markdown document.
 *  @param callback A callback function.
 */
module.exports = function post(meta, markdown, callback) {
  var base = meta.readme && meta.readme.base ?
    meta.readme.base : meta.base;
  var usetoc = meta.readme && meta.readme.toc ?
    meta.readme.toc : meta.toc;
  if(!base) return callback(null, markdown);
  var lexer = new marked.Lexer();
  var tokens = lexer.lex(markdown);
  //console.dir(tokens); process.exit();
  // make links absolute
  var links = tokens.links;
  absolute(links, base);
  var modifiers = [inline];
  if(usetoc) modifiers.push(toc(meta, toctok));
  modify(tokens, modifiers);
  console.dir(toctok);
  tokens = toctok.concat(tokens);
  tokens.links = links;
  markdown = stringify(tokens);
  callback(null, markdown);
}
