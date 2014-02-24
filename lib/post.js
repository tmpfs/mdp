var marked = require('marked');

var utils = require('cli-util');
var repeat = utils.repeat;

function stringify(tokens, modifiers) {
  modifiers = modifiers || [];
  var parts = [];
  var dnl = '\n\n';
  function nl(eol) {
    eol = eol || '\n';
    parts.push(eol);
  }
  function modify(token) {
    modifiers.forEach(function(func) {
      func(token);
    });
  }
  var li;
  var links = tokens.links;
  var linked = Object.keys(links).length > 0;
  for(var i = 0;i < tokens.length;i++) {
    token = tokens[i];
    switch(token.type) {
      case 'heading':
        // TODO: use equals for h1
        parts.push(repeat(token.depth, '#') + ' ' + token.text);
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
        modify(token);
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

function absolute(tokens, base) {
  function abs(href, base) {
    if(/^[a-z]+:\/\//.test(href)) return href;
    return base + href;
  }
  if(tokens.links) {
    for(var z in tokens.links) {
      tokens.links[z].href = abs(tokens.links[z].href, base);
    }
  }
}

/**
 *  Post process the resulting markdown document.
 */
module.exports = function post(meta, markdown, callback) {
  var base = meta.readme && meta.readme.base ?
    meta.readme.base : null;
  if(!base) return callback(null, markdown);
  var lexer = new marked.Lexer();
  var tokens = lexer.lex(markdown);

  // make links absolute
  absolute(tokens, base);

  //console.dir(tokens);

  // marked.parser(tokens)
  //
  markdown = stringify(tokens, [function(token) {
    if(token.text) {
      var re = /\[([^\]]+)\]\(([^)]*)\)/g;
      //var re = new RegExp("\\",c , 'g');
      if(re.test(token.text)) {
        console.log('GOT INLINE LINK %j', token.text);
      }
      //token.text
    }
  }]);

  callback(null, markdown);
}
