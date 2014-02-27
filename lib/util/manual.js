var EOL = require('os').EOL;
var util = require('util');
var moment = require('moment');

var defaults = require('../defaults');
var markzero = require('../md');


var elements = markzero.ManualRenderer.elements;
var th = elements.th;
var sh = elements.sh;
var comment = elements.comment;

var manual = require('manual');

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
