var time = process.hrtime();
var async = require('async');
var fs = require('fs');
var path = require('path');
var util = require('util');
var marked = require('marked');
var interface = require('cli-interface');
var cli = require('cli-command');
var Interface = interface.Interface;

var logger = require('cli-logger');

var formats = require('./formats');
var read = require('./flow/read');
var concat = require('./flow/concat');
var write = require('./flow/write');
var builder = require('./flow/build');
var tokenize = builder.tokenize;
var build = builder.build;

var js_ext = 'js', json_ext = 'json',
  md_ext = 'md', html_ext = 'html', txt_ext = 'txt';
var extensions = [js_ext, json_ext];

var usage = '[-fp] [--force] [--print] [-o=file] [-h=file] file ...';

var Readme = function() {
  Interface.apply(this, arguments);
}

util.inherits(Readme, Interface);

Readme.prototype.configure = function() {
  var conf = {help: {width: 28}};
  var pkg = this.package();
  var description = pkg.description;
  this
    .configure(conf)
    .usage(usage)
    .description(description);
}

Readme.prototype.use = function() {
  this
    .use(cli.middleware.color)
    .use(cli.middleware.logger, null, {level: {}, file: {}})
    .use(cli.middleware.debug);
}

Readme.prototype.command = function() {}

Readme.prototype.option = function() {

  var output = 'Output file(s), may be specified once for each format. ';
  output += 'The output format is determined by the file extension, ';
  output += 'md, txt, html or [1-8]. If no output files are specified ';
  output += 'then README.md is generated in the current directory.\n\n';

  output += 'If the output path is a directory then a file is created ';
  output += 'for each supported format.';

  this
    .option('-f, --force', 'Force file overwrite')
    .option('--pandoc', 'Include pandoc meta data')
    .option('--inspect', 'Enable inspect middleware')
    .option('--section [1-8]', 'Set the man page section')
    .option('-n, --filename [name]', 'Set the output file name')
    .option('--[no]-pedantic', 'Enable or disable pedantic middleware')
    .option('-p, --print [format]', 'Print document to stdout',
      cli.types.enum(formats.all))
    .option('-t, --title [title]', 'Document title')
    .option('-i, --input [file...]', 'Meta definition file(s)',
      cli.types.file('f', true, extensions))
    .option('-o, --output [file...]', output)
    // TODO: implement these
    .option('-v, --verbose', 'Print more information')
    .option('-w, --middleware [file ...]',
      'Require custom middleware', cli.types.file('fd', true, [js_ext]))
    .help()
    .version();
}

Readme.prototype.on = function() {
  this
    .on('complete', function(req) {
      var cli = this, log = this.log;
      log.level(this.verbose ? logger.INFO : logger.WARN);
      if(this.debug) log.level(logger.DEBUG);
      function done(err, list) {
        if(err) cli.raise(err);
        if(cli.print && list[cli.print]) {
          process.stdout.write(list[cli.print].document);
        }
        if(cli.verbose) {
          var diff = process.hrtime(time);
          var precision = 3;
          var nano = diff[0] * 1e9 + diff[1];
          var millis = (diff[1] / 1000000);
          log.info('completed in %ds, %dms, (%d nanoseconds)', diff[0],
            millis.toFixed(precision),
            nano);
        }
        process.exit();
      }
      var files = this.input;
      if(!files.length) {
        files = [path.join(process.cwd(), 'package.json')];
      }
      var output = cli.output;
      log.info('read: source %s', files);
      // read all input files to compose the meta data object
      read.call(cli, files, function(err, meta) {
        log.info('read: source files %s', files);
        log.trace('%j', meta);

        if(err) return done(err);
        if(!output.length) {
          output = [path.normalize(path.join(process.cwd(), 'README.md'))];
        }

        // get list of formats from file extensions
        var fmts = formats.infer.call(cli, output), result;

        if(cli.print && !fmts[cli.print]) {
          fmts[cli.print] = [];
        }

        log.info('files: formats %j', Object.keys(fmts));
        log.info('files: output %j', output);

        // read meta data into a single markdown document (source)
        concat.call(cli, meta, function(err, source) {
          if(err) return done(err);
          log.info('concat: source merge complete');
          log.trace('%s', source);

          // create document tokens (tokenize)
          log.info('token: generation start');
          tokenize.call(cli, meta, source, function(err, tokens) {
            if(err) return done(err);
            log.info('token: generation complete');
            log.info('token: body (%d), toc (%d), links(%d) generator (%d)',
              tokens.body.length,
              tokens.toc.length,
              Object.keys(tokens.links).length,
              tokens.generator.length);
            // iterate formats
            var list = Object.keys(fmts);
            async.mapSeries(list, function(format, callback) {
              log.info('document: create %s (format: %s, ext:%s)',
                fmts[format][0].file, format, fmts[format][0].ext);
              // create document for each format
              build.call(cli, fmts[format], meta, tokens, function(err, document) {
                if(err) return callback(err);
                log.info('document: generation complete (%s)', format);
                callback(null,
                  {
                    format: format,
                    document: document,
                    files: fmts[format],
                    tokens: tokens
                  });
              });
            }, function(err, formats) {
              if(err) return done(err);
              result = formats;
              log.trace('%j', result);
              // write out the documents
              async.each(formats, function(item, callback) {
                log.info('write: document(%s) %j', item.format, item.files);
                var format = item.format;
                async.each(item.files, function(info, callback) {
                  //console.dir(info);
                  //console.dir(format);
                  write.call(cli, info.file, item.document, function(err) {
                    callback(err);
                  });
                }, function(err) {
                  return callback(err);
                });
              }, function(err) {
                if(err) done(err);
                var data = {};
                result.forEach(function(item) {
                  data[item.format] = item;
                })
                return done(null, data);
              })
            });
          });
        });
      })
    });
}

module.exports = function(pkg, name, description) {
  return new Readme(pkg, name, description);
}
