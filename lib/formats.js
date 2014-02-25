var path = require('path');
var basename = path.basename;
var markdown = 'md';
var html = 'html';
var man = 'man';
var txt = 'txt';
var formats = {
  md: markdown,
  html: html,
  txt: txt
}

var manual = require('./man');

var keys = Object.keys(formats);

function infer(files) {
  var map = {};
  var i, name, ext, raw;
  for(i = 0;i < files.length;i++) {
    name = basename(files[i]);
    if(!~name.indexOf('.')) {
      this.raise("Invalid file name %s (missing extension)", [name]);
    }
    raw = ext = name.substr(name.lastIndexOf('.') + 1);
    if(!manual.match(ext) && !~keys.indexOf(ext)) {
      this.raise("Unknown file extension %s", [ext]);
    }else if(manual.match(ext)) {
      ext = man;
    }
    map[ext] = map[ext] || [];
    map[ext].push({file : files[i], format: ext, ext: raw});
  }
  return map;
}

module.exports.all = keys.concat(man);
module.exports.infer = infer;
module.exports.keys = keys;
for(var z in formats) {
  module.exports[z.toUpperCase()] = formats[z];
}
module.exports.MAN = man;
