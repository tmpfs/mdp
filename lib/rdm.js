var async = require('async');
var fs = require('fs');
var path = require('path');
var util = require('util');
var interface = require('cli-interface');
var cli = require('cli-command');
var Interface = interface.Interface;

var read = require('./read');
var render = require('./render');
var write = require('./write');

var extensions = ['js', 'json'];

var description = 'Generate markdown documents from partials.\n\n';
description += 'Designed for readme documents but may be used for any ';
description += 'markdown document.';

var usage = '[-fp] [--force] [--print] [-o=file] file ...';

var Readme = function() {
  Interface.apply(this, arguments);
}

util.inherits(Readme, Interface);

Readme.prototype.configure = function() {
  var conf = {};
  this
    .configure(conf)
    .usage(usage)
    .description(description)
    .converter(cli.types.file('f', true, extensions));
}

Readme.prototype.use = function() {
  this
    .use(cli.middleware.color)
    .use(cli.middleware.debug);
}

Readme.prototype.command = function() {}

Readme.prototype.option = function() {
  this
    .option('-f, --force', 'Force overwrite')
    .option('-p, --print', 'Print to stdout')
    .option('-t, --title [title]', 'Document title')
    .option('-o, --output [file]',
      'Output file, default is README.md in the working directory')
    .help()
    .version();
}

Readme.prototype.on = function() {
  this
    .on('complete', function(req) {
      var cli = this;
      var files = req.args;
      if(!files.length) {
        files = [path.join(process.cwd(), 'package.json')];
      }
      var ofile, output = cli.output;
      async.mapSeries(files, function(file, callback) {
        //console.log('loading %s', file);
        read.call(cli, file, function(err, meta) {
          if(!output) {
            ofile = meta.readme.output ? meta.readme.output : 'README.md';
            output = path.normalize(path.join(process.cwd(), ofile));
          }
          render.call(cli, meta, function(err, markdown) {
            if(err) return callback(err);
            callback(null, markdown);
          });
        });
      }, function(err, results) {
        if(err instanceof SyntaxError) {
          return cli.raise(new Error('json is malformed'));
        }else if(err) {
          return cli.raise(err);
        }
        var markdown = results.join('\n\n');
        if(cli.print) console.log(markdown);
        write.call(cli, output, markdown, function(err) {
          if(err) cli.raise(err);
          process.exit();
        });
      })
    });
}

module.exports = function(pkg, name, description) {
  return new Readme(pkg, name, description);
}
