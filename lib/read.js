var fs = require('fs');
var merge = require('cli-util').merge;
var defaults = require('./defaults');
function read(path, callback) {
  var cli = this, meta = merge(defaults, {});
  //console.dir(meta);
  fs.exists(path, function(exists) {
    if(!exists) return callback(new Error('file does not exist'));
    var conf;
    try {
      conf = require(path);
    }catch(e) {
      return callback(e);
    }
    if(typeof conf === 'function') {
      try {
        conf = conf();
      }catch(e) {
        return callback(e);
      }
    }
    var root = conf;
    var def = conf.readme ? conf.readme : conf;
    def = merge(def, meta);
    if(!def.partial || !Array.isArray(def.partial) || !def.partial.length) {
      return callback(new Error('no partials defined'));
    }
    //console.dir(def);
    def.root = root;
    callback(null, def);
  })
}

module.exports = read;
