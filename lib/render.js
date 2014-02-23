var async = require('async');
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
  if(!section) return section;
  if(!meta.readme.pedantic) return section;
  section = ucfirst(section);
  return /\.$/.test(section) ? section : section + period;
}

function nl(section) {
  if(!section) return section;
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

function partial(meta, section, callback) {
  if(!section) return false;
  if(typeof section === 'string') return callback(null, section);
  if(section.property) return callback(null, property(meta, section));
  if(section.include) return callback(null, include(meta, section));
  callback(null, null);
}

function partials(meta, callback) {
  var md = '';
  var list = meta.readme.partial, value;
  async.mapSeries(list, function(item, callback) {
    partial(meta, item, function(err, result) {
      if(err) return callback(err);
      callback(null, result);
    });
  }, function(err, results) {
    if(err) return callback(err);
    results = results.filter(function(result) {
      return result && typeof(result) === 'string' && result.length;
    }).map(function(result) {
      if(result) {
        return nl(pedantic(meta, result));
      }
    })
    callback(null, results);
  })
}

module.exports = function render(meta, callback) {
  var markdown = title(meta.readme);
  partials(meta, function(err, result) {
    if(err) return callback(err);
    //console.dir(result);
    markdown += result.join();
    return callback(null, markdown);
  });
}
