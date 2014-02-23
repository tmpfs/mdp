var fs = require('fs');
var path = require('path');
var util = require('util');
var interface = require('cli-interface');
var cli = require('cli-command');
var Interface = interface.Interface;

var read = require('./read');
var render = require('./render');
var write = require('./write');

var description = 'Generate markdown documents from partials.\n\n';
description += 'Designed for readme documents but may be used for any ';
description += 'markdown document.';

var usage = '[-fp] [--force] [--print]';

var Readme = function() {
  Interface.apply(this, arguments);
}

util.inherits(Readme, Interface);

Readme.prototype.configure = function() {
  var conf = {};
  this
    .configure(conf)
    .usage(usage)
    .description(description);
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
    .help()
    .version();
}

Readme.prototype.on = function() {
  this
    .on('complete', function(req) {
      var file = path.join(process.cwd(), 'package.json');
      var cli = this;
      read.call(this, file, function(err, meta) {
        if(err instanceof SyntaxError) {
          return cli.raise(new Error('json is malformed'));
        }else if(err) {
          return cli.raise(err);
        }
        file = meta.readme.output ? meta.readme.output : 'README.md';
        var output = path.normalize(path.join(process.cwd(), file));
        render.call(cli, meta, function(err, markdown) {
          if(err) return cli.raise(err);
          if(cli.print) console.log(markdown);
          write.call(cli, output, markdown, meta, function(err) {
            if(err) cli.raise(err);
            process.exit();
          })
        });
      });
    });
}

module.exports = function(pkg, name, description) {
  return new Readme(pkg, name, description);
}
