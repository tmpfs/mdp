var marked = require('marked');
module.exports = {
  MarkdownRenderer: require('./renderer'),
  TextRenderer: require('./text'),
  ManualRenderer: require('./man'),
  marked: marked
}
