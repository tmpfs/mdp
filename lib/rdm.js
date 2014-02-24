var async = require('async');
var fs = require('fs');
var path = require('path');
var util = require('util');
var marked = require('marked');
var interface = require('cli-interface');
var cli = require('cli-command');
var Interface = interface.Interface;

var read = require('./read');
var render = require('./render');
var write = require('./write');
var post = require('./post');

var extensions = ['js', 'json'];

var usage = '[-fp] [--force] [--print] [-o=file] [-h=file] file ...';

var Readme = function() {
  Interface.apply(this, arguments);
}

util.inherits(Readme, Interface);

Readme.prototype.configure = function() {
  var conf = {};
  var pkg = this.package();

  var description = pkg.description + '.\n\n';
  description += 'Designed for readme documents but may be used for any ';
  description += 'markdown document.';
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
      'Markdown output file, default is README.md in the working directory')
    .option('-h, --html [file]', 'Write html to file')
    .help()
    .version();
}

Readme.prototype.on = function() {
  this
    .on('complete', function(req) {
      var cli = this;
      function done(err, markdown, tokens) {
        if(err) cli.raise(err);
        if(cli.print) process.stdout.write(markdown);
        process.exit();
      }
      var files = req.args;
      if(!files.length) {
        files = [path.join(process.cwd(), 'package.json')];
      }
      var ofile, output = cli.output;
      async.mapSeries(files, function(file, callback) {
        read.call(cli, file, function(err, meta) {
          if(!output) {
            ofile = meta.output ? meta.output : 'README.md';
            output = path.normalize(path.join(process.cwd(), ofile));
          }
          render.call(cli, meta, function(err, markdown) {
            if(err) return callback(err);
            post(meta, markdown, function(err, result) {
              if(err) return callback(err);
              callback(null, result);
            });
          });
        });
      }, function(err, result) {
        if(err instanceof SyntaxError) {
          return cli.raise(new Error('json is malformed'));
        }else if(err) {
          return cli.raise(err);
        }
        var tokens = result[0].tokens;
        var markdown = result[0].markdown;
        write.call(cli, output, markdown, function(err) {
          if(cli.html) {
            tokens.forEach(function(token) {
              if(!token) console.log('token error %s', token);
            })
            var html = marked.parser(tokens);
            write.call(cli, cli.html, html, function(err) {
              done(err, markdown, tokens);
            });
          }else{
            done(err, markdown, tokens);
          }
        });
      })
    });
}

module.exports = function(pkg, name, description) {
  return new Readme(pkg, name, description);
}
