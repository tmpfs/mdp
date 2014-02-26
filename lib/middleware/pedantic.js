var ucfirst = require('cli-util').ucfirst;

module.exports = function middleware(meta) {
  if(!meta.pedantic) return;
  return function pedantic(token, tokens, next) {
    if(!arguments.length) return;
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      var value = token.text;
      value = ucfirst(value);
      value = /[a-zA-Z0-9]$/.test(value) ? value + meta.period : value
      // sane if it ends with some common punctuation.
      var sane = /[!?:;\.]([\*`]+)?$/.test(value);
      if(!sane) {
        // close on markdown inline formatters
        value = /[^\.][\)\]\*`]+$/.test(value) ? value + meta.period : value;
      }
      token.text = value;
    }
    next();
  }
}
