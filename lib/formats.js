var markdown = 'md';
var html = 'html';
var man = 'man';
var txt = 'txt';
var formats = {
  md: markdown,
  html: html,
  man: man,
  txt: txt
}

module.exports.map = formats;
module.exports.keys = Object.keys(formats);
for(var z in formats) {
  module.exports[z.toUpperCase()] = formats[z];
}
