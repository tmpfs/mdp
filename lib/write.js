var fs = require('fs');
module.exports = function write(file, markdown, callback) {
  var cli = this;
  fs.exists(file, function(exists) {
    if(exists && !cli.force) return callback(
      new Error('output file exists, use --force'));
    fs.writeFile(file, markdown, {encoding: 'utf8'}, function(err) {
      return callback(err);
    })
  })
}
