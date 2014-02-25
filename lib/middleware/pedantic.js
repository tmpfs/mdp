var ucfirst = require('cli-util').ucfirst;

module.exports = function(meta) {
  if(!meta.pedantic) return;
  return function(token, tokens, meta, next) {
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      var value = token.text;
      value = ucfirst(value);
      value = /[a-zA-Z0-9]$/.test(value) ? value + meta.period : value;
      token.text = value;
    }
    next();
  }
}
