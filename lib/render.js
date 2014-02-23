var eol = require('os').EOL;
var fs = require('fs');
var path = require('path');
var utils = require('cli-util');
var repeat = utils.repeat;
var ucfirst = utils.ucfirst;

var period = '.';

function title(meta) {
  return meta.title + eol + repeat(meta.title.length, '=') + repeat(2, eol);
}

function pedantic(meta, section) {
  if(!meta.readme.pedantic) return section;
  section = ucfirst(section);
  return /\.$/.test(section) ? section : section + period;
}

function nl(section) {
  var re = new RegExp(eol + '$');
  if(!re.test(section)) section += repeat(2, eol);
  return section;
}

function property(meta, section) {
  var prop = section.property;
  // TODO: deep property lookup
  return meta[prop];
}

function include(meta, section) {
  var base = meta.readme.includes ? meta.readme.includes : process.cwd();
  var file = path.normalize(path.join(base, section.include));
  // TODO: custom error handling
  var contents = '' + fs.readFileSync(file);
  contents = contents.replace(/\s+$/, '');
  return contents;
}

function partial(meta, section) {
  if(!section) return false;
  if(typeof section === 'string') return section;
  if(section.property) return property(meta, section);
  if(section.include) return include(meta, section);
}

function partials(meta) {
  var md = '';
  var list = meta.readme.partial, value;
  for(var i = 0;i < list.length;i++) {
    value = partial(meta, list[i]);
    if(!value) continue;
    md += nl(pedantic(meta, value));
  }
  return md;
}

module.exports = function render(meta, callback) {
  var markdown = title(meta.readme);
  markdown += partials(meta);
  return callback(null, markdown);
}
