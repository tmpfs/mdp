var replace = require('cli-util').pedantic;

module.exports = function middleware(meta) {
  if(!meta.pedantic) {
    return;
  }
  return function pedantic(token, tokens, next) {
    if(!arguments.length) {
      return;
    }
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      token.text = replace(token.text);
    }
    next();
  }
}
