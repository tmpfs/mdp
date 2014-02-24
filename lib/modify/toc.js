var header = require('../util/header').tok;
var link = require('../util/links').link;

/**
 *  @func toc(meta)
 *
 *  @api private
 *
 *  Creates tokens for the table of contents.
 *
 *  @param meta The generator meta data.
 *  @param toc An array to add toc tokens to.
 *  @param title A title for the toc.
 *
 *  @return A closure that modifies the toc tokens array.
 */
function toc(meta, toc, title) {
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
          {type: 'list_start', ordered: !!meta.order, depth: token.depth});
      }
      //console.log('add toc item %s', token.text);
      toc.push({type: 'list_item_start', indent: token.depth - 1});
      toc.push({type: 'text', text: link(token, meta.base)});
      toc.push({type: 'list_item_end'});
      depth = token.depth;
    }
    if(token === tokens[tokens.length - 1]) end(false);
  }
}

module.exports = toc;
