var EOL = require('os').EOL;
var moment = require('moment');

function metadata(meta) {
  var prefix = '% ';
  var title = meta.root.title || meta.root.name || 'README';
  var author = meta.author || meta.root.author;
  var dt = moment();
  var date = dt.format('dddd, Do MMMM YYYY');
  var str = prefix + title + EOL;
  if(author) str += prefix + author + EOL;
  str += prefix + date + EOL;
  return str;
}

module.exports = {
  meta: metadata
}
