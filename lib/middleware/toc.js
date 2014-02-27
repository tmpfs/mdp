var markzero = require('markzero');
var link = markzero.links.link;
var header = markzero.tokens.header;

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
module.exports = function middleware(meta, table) {
  if(!arguments.length) return;
  var depth = 0, current;
  var title = meta.toc;
  if(title && typeof title === 'string') {
    table.push(header(title));
  }
  return function toc(token, tokens, next) {
    if(!arguments.length) return;
    function end(flag) {
      table.push({type: 'list_end', toc: flag});
    }
    if(token.type === 'heading') {
      if(token.depth !== depth) {
        if(current) end(true);
        current = token;
        table.push(
          {type: 'list_start', ordered: !!meta.order, depth: token.depth});
      }
      table.push({type: 'list_item_start',
        indent: token.depth - 1});
      table.push({type: 'text', text: link(token, meta)});
      table.push({type: 'list_item_end'});
      depth = token.depth;
    }
    if(token === tokens[tokens.length - 1]) end(false);
    next();
  }
}
