var marked = require('marked');
var utils = require('cli-util');
var repeat = utils.repeat;

var generator = require('../util/generator');
var footer = require('../util/footer');
var middleware = require('../middleware');
var stringify = require('../md/stringify');
var pandoc = require('../util/pandoc');
var manual = require('../util/manual');

var markzero = require('../md');
var elements = markzero.ManualRenderer.elements;
var sh = elements.sh;

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
  var i = 0, scope = this;
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
      if(err) return callback(err);
      j++;
      if(j < list.length) {
        exec();
      }else{
        complete();
      }
    }
    function exec() {
      var func = list[j];
      func.call(scope, token, tokens, meta, function(err) {
        next(err);
      });
    }
    exec();
  }
  tok();
}

/**
 *  @func parse(meta, markdown, callback)
 *
 *  Post process the generated markdown document.
 *
 *  @param meta The meta data.
 *  @param markdown The markdown document.
 *  @param callback A callback function.
 */
module.exports = function parse(meta, markdown, callback) {
  var cli = this;
  var metadata = cli.pandoc ? pandoc.meta.call(this, meta) : '';
  if(cli.man) metadata = manual.meta.call(this, meta);
  var lexer = new marked.Lexer(meta.marked);
  var tokens = lexer.lex(markdown);
  var gentok;
  if(meta.generator) {
    gentok = generator(meta);
  }
  //var has = meta.toc || meta.base || meta.pedantic
    //|| Array.isArray(meta.middleware)
    //|| (Array.isArray(this.middleware) && this.middleware.length);

  // nothing to be done - shortcut out
  //if(!has) {
    //return callback(
      //null, {markdown: metadata + markdown, tokens: tokens.concat(gentok)});
  //}

  // list of tokens for the table of contents
  var toctok = [];

  // make footer links absolute
  var links = tokens.links;
  footer(meta, links);

  // build list of modifiers and execute
  var modifiers = [];
  if(meta.toc) {
    modifiers.push(middleware.toc.call(this, meta, toctok));
  }
  if(meta.base) {
    modifiers.push(middleware.absolute.call(this, meta));
  }
  if(meta.pedantic) {
    modifiers.push(middleware.pedantic.call(this, meta));
  }

  meta.middleware = meta.middleware || [];
  var custom = [];
  meta.middleware.forEach(function(key) {
    var closure;
    if(middleware[key]) {
      closure = middleware[key].call(this, meta)
    }
    if(closure) custom.push(closure);
  })

  if(!~meta.middleware.indexOf('inspect') && cli.inspect) {
    custom.push(middleware.inspect.call(this, meta));
  }

  modifiers = modifiers.concat(custom);

  run.call(this, tokens, meta, modifiers, function(err) {
    if(err) return callback(err);

    // prepend toc
    if(!cli.man) {
      tokens = toctok.concat(tokens);
    }
    if(gentok && !cli.man) {
      tokens = tokens.concat(gentok);
    }
    // assume a description heading after preamble
    if(cli.man && tokens.length) {
      var token = tokens[0];
      if(token.type !== 'heading') {
        tokens = [{type: 'heading', text: 'DESCRIPTION', level: 1}]
          .concat(tokens);
      }
    }

    // links must be re-assigned after all concat calls
    tokens.links = links;

    // get an updated string representation of the document
    var renderer = cli.text
      ? new markzero.TextRenderer : new markzero.MarkdownRenderer;
    if(cli.man) {
      renderer = new markzero.ManualRenderer;
    }
    markdown = metadata + stringify(tokens, renderer);
    // append link list
    if(renderer.links && renderer.links.length) {
      var linklist = renderer.getLinks();
      tokens = tokens.concat(linklist);
      tokens.links = linklist.links = {};
      markdown += stringify(linklist, renderer);
    }
    callback(null, {markdown: markdown, tokens: tokens});
  });
}
