var fs = require('fs');
module.exports = function write(file, content, callback) {
  var cli = this;
  fs.exists(file, function(exists) {
    if(exists && !cli.force) {
      return cli.raise('output file %s exists, use --force', [file]);
    }
    fs.writeFile(file, content, {encoding: 'utf8'}, function(err) {
      return callback(err);
    })
  })
}
