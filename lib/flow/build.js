var utils = require('cli-util')
  , merge = utils.merge
  , markzero = require('markzero')
  , stringify = markzero.stringify
  , generator = require('../util/generator')
  , footer = require('../util/footer')
  , middleware = require('../middleware')
  , pandoc = require('../util/pandoc')
  , manual = require('../util/manual');

/**
 *  @func exec(tokens, [modifiers])
 *
 *  @api private
 *
 *  Executes the modify functions to alter
 *  the token list.
 *
 *  @param tokens The lexer tokens.
 *  @param modifiers An array of modifier functions.
 */
function run(tokens, meta, list, callback) {
  var i = 0, scope = this, timer, timeout = this.timeout || 10000;
  // completed all functions for a token
  function complete() {
    i++;
    if(i < tokens.length) {
      tok();
    }else{
      callback();
    }
  }
  // run all middleware for a token
  function tok() {
    var token = tokens[i];
    var j = 0;
    function next(err) {
      clearTimeout(timer);
      if(err) {
        return callback(err);
      }
      j++;
      if(j < list.length) {
        exec();
      }else{
        complete();
      }
    }
    function exec() {
      var func = list[j];
      var name = new func().constructor.name;
      timer = setTimeout(function() {
        scope.raise('middleware function %s timed out in %ds, ' +
          'possibly failed to call next()',
          [name, (timeout / 1000).toFixed(3)]);
        process.exit();
      }, timeout)
      func.call(scope, token, tokens, next);
    }
    exec();
  }
  tok();
}

function use(meta, toc) {
  var modifiers = [], cli = this;
  function add(closure) {
    if(typeof closure !== 'function') {
      cli.raise('middleware return value is not a function (closure)');
    }
    modifiers.push(closure);
  }
  var usetoc = meta.toc === true || typeof meta.toc === 'string';
  if(cli.toc === false && !cli.tocTitle) {
    usetoc = false;
  }
  if(cli.tocTitle) {
    usetoc = true;
  }
  if(usetoc) {
    add(middleware.toc.call(this, meta, toc, cli.tocTitle));
  }
  if(cli.base || meta.base) {
    add(middleware.absolute.call(this, meta));
  }
  var pedantic = typeof(cli.pedantic) === 'boolean'
    ? cli.pedantic : meta.pedantic;
  if(pedantic) {
    add(middleware.pedantic.call(this, meta));
  }

  meta.middleware = meta.middleware || [];
  meta.middleware.forEach(function(key) {
    var closure;
    if(middleware[key]) {
      closure = middleware[key].call(this, meta)
      add(closure);
    }
  })
  if(!~meta.middleware.indexOf('inspect') && this.inspect) {
    add(middleware.inspect.call(this, meta));
  }

  // fetch closure names
  var names = [];
  for(var i = 0;i < modifiers.length;i++) {
    try {
      names.push(new modifiers[i]().constructor.name);
    }catch(e) {
      this.raise('error creating middleware instance');
    }
    if(!names[i]) {
      this.raise(
        'middleware closure does not have a name, cannot be anonymous');
    }
  }
  this.log.info('middleware: %s', names.join(', '));
  return modifiers;
}

/**
 *  @func tokenize(meta, markdown, callback)
 *
 *  Generate source markdown tokens.
 *
 *  @param meta The meta data.
 *  @param markdown The markdown document.
 *  @param callback A callback function.
 */
function tokenize(meta, markdown, callback) {
  var lexer = new markzero.Lexer(meta.markzero);
  var tokens = lexer.lex(markdown);
  var gentok = [];
  if(meta.generator) {
    gentok = generator(meta);
  }
  // list of tokens for the table of contents
  var toc = [];

  // make footer links absolute
  var links = tokens.links;
  footer(meta, links);

  // build list of middleware
  var closures = use.call(this, meta, toc);
  // execute middleware
  run.call(this, tokens, meta, closures, function(err) {
    if(err) {
      return callback(err);
    }
    callback(null, {body: tokens, toc: toc, generator: gentok, links: links});
  });
}

var handlers = {
  md: md,
  txt: txt,
  man: man,
  html: html,
  xhtml: xhtml
}

function md(meta, tokens, info, callback) {
  var metadata = this.pandoc ? pandoc.meta.call(this, meta) : '';
  var toks = tokens.body.slice(0);
  toks = tokens.toc.concat(tokens.body);
  toks = toks.concat(tokens.generator);
  toks.links = tokens.links;
  var renderer = new markzero.MarkdownRenderer();
  var document = metadata + stringify(toks, renderer);
  callback(null, document);
}

function html(meta, tokens, info, callback) {
  var toks = tokens.body.slice(0);
  toks = tokens.toc.concat(tokens.body);
  toks = toks.concat(tokens.generator);
  toks.links = tokens.links;
  markzero.defaults.renderer = new markzero.Renderer();
  var opts = merge(markzero.defaults, {});
  var document = markzero.parser(toks, opts);
  callback(null, document);
}

function xhtml(meta, tokens, info, callback) {
  var toks = tokens.body.slice(0);
  toks = tokens.toc.concat(tokens.body);
  toks = toks.concat(tokens.generator);
  toks.links = tokens.links;
  markzero.defaults.renderer = new markzero.Renderer();
  var opts = merge(markzero.defaults, {});
  opts.xhtml = true;
  var document = markzero.parser(toks, opts);
  callback(null, document);
}

function txt(meta, tokens, info, callback) {
  var toks = tokens.body.slice(0);
  toks = tokens.toc.concat(tokens.body);
  toks = toks.concat(tokens.generator);
  toks.links = tokens.links;
  var renderer = new markzero.TextRenderer();
  var document = stringify(toks, renderer, true);
  var linklist = renderer.getLinks();
  document += stringify(linklist, renderer);
  callback(null, document);
}

function man(meta, tokens, info, callback) {
  var metadata = manual.meta.call(this, meta, info.ext);
  var toks = tokens.body.slice(0);
  if(toks.length) {
    var token = toks[0];
    if(token.type !== 'heading') {
      toks.unshift({type: 'heading', text: 'DESCRIPTION', level: 1});
    }
  }
  toks.links = tokens.links;
  var renderer = new markzero.ManualRenderer();
  var document = metadata + stringify(toks, renderer, true);
  var linklist = renderer.getLinks();
  document += stringify(linklist, renderer);
  callback(null, document);
}

function build(info, meta, tokens, callback) {
  handlers[info[0].format].call(this, meta, tokens, info[0], callback);
}

module.exports.build = build;
module.exports.tokenize = tokenize;
