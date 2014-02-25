var EOL = require('os').EOL;
var util = require('util');
var moment = require('moment');

var defaults = require('../defaults');
var markzero = require('../md');
var elements = markzero.ManualRenderer.elements;
var th = elements.th;
var sh = elements.sh;
var comment = elements.comment;

function metadata(meta) {
  var section = this.section || 1;
  var sname = "User Commands";
  var title = meta.root.title || meta.root.name || 'README';
  var name = title.replace(/\([0-9]+\)$/, '')
  title = name.toUpperCase();
  var version = name + ' ' + (meta.root.version || meta.version || '1.0');
  var dt = moment();
  var date = dt.format('MMMM YYYY');
  var generator = "DO NOT MODIFY THIS FILE: " + defaults.generator;
  var str = util.format(comment, generator);
  str += util.format(th, title, section, date, version, sname);
  str += util.format(sh, 'NAME');

  // slight duplication when a description is referenced at
  // the start of the document but ok for now
  var description = meta.root.description || '';
  if(description) {
    str += util.format('%s \\- %s\n', name, description);
  }else{
    str += util.format('%s\n', name);
  }
  return str;
}

module.exports = {
  meta: metadata
}
