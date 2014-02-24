var EOL = require('os').EOL;
var repeat = require('cli-util').repeat;
var header = require('./header');

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
  var dnl = repeat(2, EOL);
  function nl(eol) {
    eol = eol || EOL;
    parts.push(eol);
  }
  var i, z, li, padding, counter = 1, order = false;
  for(i = 0;i < tokens.length;i++) {
    token = tokens[i];
    switch(token.type) {
      case 'heading':
        if(token.depth == 1) {
          parts.push(header(token));
        }else{
          parts.push(repeat(token.depth, '#') + ' ' + token.text);
        }
        nl(dnl);
        break;
      case 'blockquote_start':
        parts.push('> ');
        break;
      case 'blockquote_end':
        //nl(dnl);
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
        // TODO: handle ordered lists
        if(token.ordered) {
          counter = 1;
          order = true;
        }
        li = !token.ordered ? '*' : counter + '.';
        break;
      case 'list_item_start':
        if(order) li = counter + '.';
        padding = token.indent ? repeat(token.indent * 2) : '';
        ++i; token = tokens[i];
        if(token) parts.push(padding + li + ' ' + token.text);
        break;
      case 'list_item_end':
        counter++;
        nl();
        break;
      case 'list_end':
        if(!token.toc) nl();
        order = false;
        counter = 1;
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
  for(z in tokens.links) {
    // TODO: handle link titles
    parts.push('[' + z + ']: ' + tokens.links[z].href);
    nl();
  }
  return parts.join('');
}

module.exports = stringify;
