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
function toc(meta, toc) {
  var depth = 0, current;
  var title = meta.toc;
  if(title && typeof title === 'string') {
    toc.push(header(title));
  }
  return function(token, tokens, meta, callback) {
    function end(flag) {
      toc.push({type: 'list_end', toc: flag});
    }
    if(token.type === 'heading') {
      if(token.depth !== depth) {
        if(current) end(true);
        current = token;
        toc.push(
          {type: 'list_start', ordered: !!meta.order, depth: token.depth});
      }
      toc.push({type: 'list_item_start', indent: token.depth - 1});
      toc.push({type: 'text', text: link(token, meta.base)});
      toc.push({type: 'list_item_end'});
      depth = token.depth;
    }
    if(token === tokens[tokens.length - 1]) end(false);
    callback();
  }
}

module.exports = toc;
