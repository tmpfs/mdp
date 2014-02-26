var fs = require('fs');
var path = require('path');
var basename = path.basename;
var markdown = 'md';
var html = 'html';
var man = 'man';
var txt = 'txt';
var xhtml = 'xhtml';

// map file extensions to
// format identifiers
var formats = {
  md: markdown,
  html: html,
  txt: txt,
  xhtml: xhtml
}

//var xext = ['xhtml', 'xml'];
//xext.forEach(function(ext) {
  //formats[ext] = xhtml;
//})
//console.dir(formats);

var manual = require('./man');

var keys = Object.keys(formats);

function infer(files) {
  var map = {};
  var i, file, name, ext, raw, stat, fname, section = this.section || 1, list;
  function add(format, file, ext, raw) {
    //ext = raw || ext;
    map[ext] = map[ext] || [];
    map[ext].push({file: file, format: format, ext: ext});
  }
  for(i = 0;i < files.length;i++) {
    file = files[i];
    try {
      stat = fs.statSync(file);
    }catch(e){}
    name = basename(files[i]);
    if(stat && stat.isDirectory()) {
      fname = this.filename || 'README';
      //list = keys.slice(0);
      // remove xml from the list to prevent duplicate files
      //list.pop();
      keys.forEach(function(ext) {
        format = formats[ext];
        add(format, path.join(file, fname + '.' + ext), ext);
      })
      // also add the man format
      ext = section;
      add(man, path.join(file, fname + '.' + ext), ext);
    }else{
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
        this.log.warn('duplicate file detected for format %s', ext);
        if(existing !== file) {
          this.log.warn('using %s instead of %s', file, existing);
        }
        map[ext] = [];
      }
      map[ext] = map[ext] || [];
      map[ext].push({file : file, format: formats[ext], ext: raw});
    }
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
