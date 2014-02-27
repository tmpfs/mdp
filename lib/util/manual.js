var moment = require('moment');
var manual = require('manual');

var defaults = require('../defaults');

function metadata(meta, section) {
  var title = meta.root.title || meta.root.name || 'README';
  var opts = {
    comment: "DO NOT MODIFY THIS FILE: " + defaults.generator,
    version: meta.root.version || meta.version,
    date: moment().format('MMMM YYYY'),
    title: title,
    section: section,
    name: manual.strip(title),
    description: meta.root.description || ''
  }
  return manual.preamble(opts);
}

module.exports = {
  meta: metadata
}
