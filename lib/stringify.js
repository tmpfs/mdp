var EOL = require('os').EOL;
var repeat = require('cli-util').repeat;
var header = require('./header');

var Renderer = require('./md/renderer');
var Parser = require('./md/parser');

var links = require('./links');

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
  var parser = new Parser({renderer: new Renderer});
  var md =  parser.parse(tokens);
  for(var z in tokens.links) {
    // TODO: handle link titles
    md += '[' + z + ']: ' + tokens.links[z].href + EOL;
  }
  return md;

  var parts = [];
  var dnl = repeat(2, EOL);
  function nl(eol) {
    eol = eol || EOL;
    parts.push(eol);
  }
  var i, z, li, padding, previous;
  // list variables
  var lists = [], depth = -1;
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
        //if(depth > 0 && previous && previous.type === 'list_end') {
          //depth--;
        //}else{
        //}
        depth++;
        console.log('start list at depth: %s', depth);
        console.dir(lists[depth]);
        lists[depth] = {
          counter: lists[depth] ? lists[depth].counter : 1,
          ordered: token.ordered};
        li = !token.ordered ? '*' : lists[depth].counter + '.';
        break;
      case 'list_item_start':
        if(lists[depth].ordered) li = lists[depth].counter + '.';
        padding = token.indent ? repeat(token.indent * 2) : '';
        // TODO: gobble everything upto list_item_end
        ++i; token = tokens[i];
        console.log('list item %s', token.text);
        //if(!lists[depth].start) lists[depth].start = token.text;
        if(token) parts.push(padding + li + ' ' + token.text);
        break;
      case 'list_item_end':
        lists[depth].counter++;
        nl();
        break;
      case 'list_end':
        if(!token.toc) nl();
        console.log('end list: %s', tokens[i + 1].type);
        li = null;
        // consecutive list
        if(tokens[i + 1] && tokens[i + 1].type !== 'list_start') {
          if(depth > 0) lists.pop();
          console.dir(lists.length);
          console.dir(lists)
          depth--;
        }
        break;
      case 'paragraph':
        parts.push(token.text);
        nl(dnl);
        break;
      default:
        parts.push(token.text);
    }
    previous = token;
  }
  for(z in tokens.links) {
    // TODO: handle link titles
    parts.push('[' + z + ']: ' + tokens.links[z].href);
    nl();
  }
  return parts.join('');
}

module.exports = stringify;
