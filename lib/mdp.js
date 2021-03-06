var time = process.hrtime()
  , async = require('async')
  , path = require('path')
  , util = require('util')
  , CommandInterface = require('cli-interface').CommandInterface
  , types = require('cli-types')
  , formats = require('./formats')
  , read = require('./flow/read')
  , concat = require('./flow/concat')
  , write = require('./flow/write')
  , builder = require('./flow/build')
  , tokenize = builder.tokenize
  , build = builder.build
  , js_ext = 'js'
  , json_ext = 'json'
  , extensions = [js_ext, json_ext];

var options = {
  options: {
    section: {
      converter: types.integer,
      value: 1
    },
    print: types.enum(formats.all),
    timeout: {
      converter: types.integer,
      value: 10000
    },
    input: types.file('f', true, extensions),
    middleware: types.file('fd', true, [js_ext])
  }
};

var MarkdownProcessor = function() {
  CommandInterface.apply(this, arguments);
}

util.inherits(MarkdownProcessor, CommandInterface);

MarkdownProcessor.prototype.configure = function() {
  var file = path.join(__dirname, 'mdp.md');
  var conf = {
    trace: process.env.NODE_ENV === 'devel',
    help: {width: 28},
    compiler: {
      input: [file],
      definition: options
    }
  }

  var pkg = this.package();
  var description = pkg.description;
  this
    .configure(conf)
    .description(description);
}

MarkdownProcessor.prototype.use = function() {
  this
    .use(require('cli-mid-color'))
    .use(require('cli-mid-logger'), null, {level: {}, file: {}})
    .use(require('cli-mid-debug'))
    .use(require('cli-mid-verbose'));
}

MarkdownProcessor.prototype.on = function() {
  this
    .on('load', function(/*req*/) {
      this.help('-h, --help')
        .version();
    })
    .on('complete', function(req) {
      var debug = this.debug;
      //console.dir(this._options.pedantic);
      if(debug) {
        this.log.debug(JSON.stringify(req, undefined, 2));
      }
      var cli = this, log = this.log;
      //log.level(this.verbose ? logger.INFO : logger.WARN);
      //if(this.debug) log.level(logger.DEBUG);
      function done(err, list) {
        if(err) {
          cli.raise(err);
        }
        if(cli.print && list[cli.print]) {
          process.stdout.write(list[cli.print].document);
        }
        if(cli.verbose) {
          var diff = process.hrtime(time);
          var precision = 3;
          var millis = (diff[1] / 1000000);
          log.info('completed in %ds, %dms', diff[0],
            millis.toFixed(precision));
        }
        process.exit();
      }
      var files = this.input;
      if(!files.length) {
        files = [path.join(process.cwd(), 'package.json')];
      }
      var output = cli.output;
      log.info('read: source %s', files.join(', '));
      // read all input files to compose the meta data object
      read.call(cli, files, function(err, meta) {
        log.info('read: source files %s', files);
        //log.trace('%j', meta);
        if(debug) {
          log.debug(JSON.stringify(meta, undefined, 2));
        }

        if(err) {
          return done(err);
        }
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
          if(err) {
            return done(err);
          }
          log.info('concat: source merge complete');
          log.trace('%s', source);

          // create document tokens (tokenize)
          log.info('token: generation start');
          tokenize.call(cli, meta, source, function(err, tokens) {
            if(err) {
              return done(err);
            }
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
              build.call(
                cli, fmts[format], meta, tokens, function(err, document) {
                if(err) {
                  return callback(err);
                }
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
              if(err) {
                return done(err);
              }
              result = formats;
              log.trace('%j', result);
              // write out the documents
              async.each(formats, function(item, callback) {
                log.info('write: document(%s) %j', item.format, item.files);
                async.each(item.files, function(info, callback) {
                  write.call(cli, info.file, item.document, function(err) {
                    callback(err);
                  });
                }, function(err) {
                  return callback(err);
                });
              }, function(err) {
                if(err) {
                  done(err);
                }
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
  return new MarkdownProcessor(pkg, name, description);
}

module.exports = function(pkg) {
  return new MarkdownProcessor(pkg);
}
