var async = require('async');
var fs = require('fs');
var merge = require('cli-util').merge;
var defaults = require('./defaults');
function load(path, callback) {
  var cli = this, meta = merge(defaults, {});
  //console.dir(meta);
  fs.exists(path, function(exists) {
    if(!exists) return callback(new Error('file does not exist'));
    var conf;
    try {
      conf = require(path);
    }catch(e) {
      return callback(e);
    }
    if(typeof conf === 'function') {
      try {
        conf = conf();
      }catch(e) {
        return callback(e);
      }
    }
    callback(null, conf);
  })
}

function read(files, callback) {
  //console.dir(files);
  var cli = this;
  var meta = {};
  async.mapSeries(files, function(file, callback) {
    load.call(cli, file, function(err, meta) {
      if(err) {
        //TODO: issue warning on file load failure
      }
      //console.log('meta %j',meta );
      callback(null, meta);
    });
  }, function(err, conf) {
    conf = conf.filter(function(item) {
      if(item) return item;
    })
    if(!conf.length) {
      // TODO: include files searched
      return callback(new Error('No meta data found'));
    }
    // combine all results
    var target = {};
    conf.forEach(function(item) {
      merge(item, target);
    })

    var root = target;
    target = target.readme ? target.readme : target;
    // we need to merge again to handle the circular reference
    target = merge(target, {});
    if(!target.partial
      || !Array.isArray(target.partial) || !target.partial.length) {
      return callback(new Error('no partials defined'));
    }
    target.root = root;
    //console.dir(target);
    callback(err, target);
  })
}

module.exports = read;
