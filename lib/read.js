var fs = require('fs');
module.exports = function read(path, callback) {
  var cli = this;
  fs.exists(path, function(exists) {
    if(!exists) return callback(new Error('file does not exist'));
    var meta;
    try {
      meta = require(path);
      //meta = meta.readme ? meta.readme : meta;
    }catch(e) {
      return callback(e);
    }
    var readme = meta.readme ? meta.readme : meta;
    if(!readme.title) return callback(new Error('no title defined'));
    if(!readme.partial || !Array.isArray(readme.partial)) {
      return callback(new Error('no partials defined'));
    }
    callback(null, meta);
  })
}
