var header = require('./header').tok;
var link = require('./links').link;

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

module.exports = toc;
