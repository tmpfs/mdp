var ucfirst = require('cli-util').ucfirst;

module.exports = function(meta) {
  if(!meta.pedantic) return;
  return function(token, tokens, meta, next) {
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      var value = token.text;
      value = ucfirst(value);
      value = /[\.:!?]\s*$/.test(value) ? value : value + meta.period;
      token.text = value;
    }
    next();
  }
}
