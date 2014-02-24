
module.exports = function(meta) {
  if(!meta.pedantic) return;
  return function(meta, section, value) {
    var types = ['paragraph', 'text'];
    if(token.text && ~types.indexOf(token.type)) {
      var value = token.text;
      value = ucfirst(value);
      value = /[\.:!?]$/.test(value) ? value : value + period;
      token.text = value;
    }
  }
}
