var async = require('async');
var fs = require('fs');
var path = require('path');
var util = require('util');
var marked = require('marked');
var interface = require('cli-interface');
var cli = require('cli-command');
var Interface = interface.Interface;

var read = require('./flow/read');
var concat = require('./flow/concat');
var write = require('./flow/write');
var parse = require('./flow/parse');

var js_ext = 'js', json_ext = 'json';
var extensions = [js_ext, json_ext];

var usage = '[-fp] [--force] [--print] [-o=file] [-h=file] file ...';

var Readme = function() {
  Interface.apply(this, arguments);
}

util.inherits(Readme, Interface);

Readme.prototype.configure = function() {
  var conf = {help: {width: 22}};
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
    .option('-f, --force', 'Force file overwrite')
    .option('--inspect', 'Enable inspect middleware')
    .option('-m, --md', 'Print markdown to stdout')
    .option('--text',
      'Use a plain text renderer, default output is README.txt')
    .option('-t, --title [title]', 'Document title')
    .option('-o, --output [file]',
      'Output file, default is README.md')
    .option('-h, --html [file]', 'Write html to file')
    // TODO: implement these
    .option('-v, --verbose', 'Print more information')
    .option('-w, --middleware [file ...]',
      'Require custom middleware', cli.types.file('f', true, [js_ext]))
    .help()
    .version();
}

Readme.prototype.on = function() {
  this
    .on('complete', function(req) {
      var cli = this;
      function done(err, markdown, tokens) {
        if(err) cli.raise(err);
        if(cli.md) process.stdout.write(markdown);
        process.exit();
      }
      var files = req.args, defaults = files.length == 0;
      if(!files.length) {
        files = [
          path.join(process.cwd(), 'package.json'),
          path.join(process.cwd(), 'mdp.json')];
      }
      var ofile, output = cli.output;
      // read all input files to compose the meta data object
      read.call(cli, files, function(err, meta) {
        if(err) return done(err);
        if(!output) {
          ofile = meta.output
            ? meta.output : (cli.text ? 'README.txt' : 'README.md');
          output = path.normalize(path.join(process.cwd(), ofile));
        }
        // read meta data into a single markdown document
        concat.call(cli, meta, function(err, markdown) {
          if(err) return done(err);
          // parse the markdown document
          // convert to tokens and run modifiers to generate
          // toc and make links absolute etc.
          parse.call(cli, meta, markdown, function(err, result) {
            if(err) return done(err);
            var tokens = result.tokens;
            var markdown = result.markdown;
            // write the output file
            write.call(cli, output, markdown, function(err) {
              // write html version if necessary
              if(cli.html) {
                var html = marked.parser(tokens);
                write.call(cli, cli.html, html, function(err) {
                  done(err, markdown, tokens);
                });
              }else{
                done(err, markdown, tokens);
              }
            });
          });
        });
      })
    });
}

module.exports = function(pkg, name, description) {
  return new Readme(pkg, name, description);
}