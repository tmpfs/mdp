var async = require('async');
var EOL = require('os').EOL;
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var dirname = path.dirname;
var util = require('util');
var circular = require('circular');
var repeat = require('cli-util').repeat;

var formats = {
  code: '```' + EOL + '%s' + EOL + '```',
  language: '```%s' + EOL + '%s' + EOL + '```'
}

// TODO: move to utils.rtrim
function rtrim(str) {
  if(!str || typeof str !== 'string') return str;
  return str.replace(/\s+$/, '');
}

function title(meta) {
  var title = this.title || meta.title;
  if(!title) return '';
  return title + EOL + repeat(title.length, '=') + repeat(2, EOL);
}

function nl(section) {
  if(!section) return section;
  var re = new RegExp(EOL + '$');
  if(!re.test(section)) section += repeat(2, EOL);
  return section;
}

function property(meta, section) {
  var prop = section.property;
  // non-string properties are not references
  if(typeof prop !== 'string') {
    return prop;
  }
  // TODO: deep property lookup
  return meta.root[prop];
}

function stringify(meta, section, value) {
  if(!section.stringify) return value;
  return JSON.stringify(value, circular(), section.indent || 2);
}

function format(meta, section, value) {
  var format = type(meta, section, value);
  if(!format && typeof value === 'string') return value;
  if(typeof value === 'string') {
    if(section.language) {
      return util.format(format, section.language, value);
    }
    //console.dir(format);
    return util.format(format, value);
  }else{
    if(typeof value === 'function') {
      value = '' + value;
    }else{
      value = JSON.stringify(value, circular(), 2);
    }
    var str = section.language
      ? '```' + section.language + EOL
      : '```' + EOL;
    str += value + EOL + '```';
    return str;
  }
}

function type(meta, section, value) {
  var fmt = section.format;
  if(section.type && formats[section.type]) {
    fmt = section.language ? formats.language : formats[section.type];
  }
  return fmt;
}

function include(meta, section, callback) {
  var base = meta.includes ? meta.includes : process.cwd();
  var file = path.normalize(path.join(base, section.include));
  // TODO: custom error handling
  fs.readFile(file, function(err, result) {
    if(err) return callback(err);
    result = '' + result;
    result = rtrim(result);
    callback(null, result);
  })
}

function script(meta, section, callback) {
  var cmd = section.script;
  //console.dir(cmd);
  var opts = {env: {}, cwd: section.cwd || process.cwd()}, z;
  //console.dir(process.env);
  //console.log(process.env.PATH);
  for(z in process.env) {
    opts.env[z] = process.env[z];

  }
  if(section.env) {
    for(z in section.env) {
      opts.env[z] = section.env[z];
    }
  }
  //console.dir(section.env);
  //console.dir(opts.env.cli_toolkit_help_markdown_header);
  var paths = ['./node_modules/.bin', './bin', './sbin'];
  if(meta.directories && meta.directories.bin) {
    paths.push(meta.directories.bin);
  }
  opts.env.PATH = opts.env.PATH + ':' + './node_modules/.bin';
  var bin = meta.bin || meta.files && meta.files.bin ? meta.files.bin : null;
  if(bin) {
    if(typeof bin === 'string') {
      paths.push(dirname(bin));
    }else{
      for(z in bin) {
        if(bin[z]) paths.push(dirname(bin[z]));
      }
    }
  }
  opts.env.PATH = opts.env.PATH + ':' + paths.join(':');
  var ps = exec(cmd, opts,
    function (err, stdout, stderr) {
      //console.log('stdout: ' + stdout);
      //console.log('stderr: ' + stderr);
      if(err !== null) {
        //console.log('exec error: ' + err);
        return callback(err);
      }
      return callback(null, section.stderr ? stderr : stdout);
  });
}


function partial(meta, section, callback) {
  var result, pth;
  if(!section) return false;
  if(typeof section === 'string') return callback(null, section);
  if(section.property) return callback(null, property(meta, section));
  if(section.require) {
    try {
      pth = section.require;
      if(meta.require) {
        pth = path.join(meta.require, pth);
      }
      if(!/^\//.test(section.require)) pth = path.join(process.cwd(), pth);
      result = require(pth);
    }catch(e) {
      return callback(e);
    }
    return callback(null, result);
  }
  if(section.include) {
    include(meta, section, function(err, result) {
      callback(err, result);
    })
  }else if(section.script) {
    script(meta, section, function(err, result) {
      callback(err, result);
    })
  }else{
    callback(null, null);
  }
}

function partials(meta, callback) {
  var md = '';
  var list = meta.partial, value;
  if(meta.links) {
    list.push({include: meta.links});
  }
  async.mapSeries(list, function(item, callback) {
    partial(meta, item, function(err, result) {
      if(err) return callback(err);
      callback(null, {section: item, result: result});
    });
  }, function(err, results) {
    if(err) return callback(err);
    results = results.filter(function(def) {
      return def.result !== null;
    }).map(function(def) {
      var section = def.section;
      var result = def.result;
      if(result) {
        result = stringify(meta, section, result);
        result = format(meta, section, result);
        return nl(result);
      }
    })
    callback(null, results);
  })
}

module.exports = function render(meta, callback) {
  var markdown = title.call(this, meta);
  partials(meta, function(err, result) {
    if(err) return callback(err);
    markdown += result.join('');
    return callback(null, markdown);
  });
}
