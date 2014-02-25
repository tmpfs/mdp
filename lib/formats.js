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
  var i, file, name, ext, raw;
  for(i = 0;i < files.length;i++) {
    file = files[i];
    name = basename(files[i]);
    if(!~name.indexOf('.')) {
      this.raise("invalid file name %s (missing extension)", [name]);
    }
    raw = ext = name.substr(name.lastIndexOf('.') + 1);
    if(!manual.match(ext) && !~keys.indexOf(ext)) {
      this.raise("unknown file extension %s", [ext]);
    }else if(manual.match(ext)) {
      ext = man;
    }
    if(map[ext] && map[ext].length) {
      var existing = map[ext][0].file;
      console.warn('duplicate file detected for format %s', ext);
      if(existing !== file) {
        console.warn('using %s instead of %s', file, existing);
      }
      map[ext] = [];
    }
    map[ext] = map[ext] || [];
    map[ext].push({file : file, format: ext, ext: raw});
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
