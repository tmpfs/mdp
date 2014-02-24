var marked = require('marked');
var utils = require('cli-util');
var repeat = utils.repeat;

var generator = require('../util/generator');
var footer = require('../util/footer');
var middleware = require('../middleware');
var stringify = require('../md/stringify');

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
  var lexer = new marked.Lexer(meta.marked);
  var tokens = lexer.lex(markdown);
  var gentok;
  if(meta.generator) {
    gentok = generator(meta);
  }
  var has = meta.toc || meta.base || meta.pedantic
    || Array.isArray(meta.middleware)
    || (Array.isArray(this.middleware) && this.middleware.length);
  // nothing to be done - shortcut out
  if(!has) {
    return callback(
      null, {markdown: markdown, tokens: tokens.concat(gentok)});
  }

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

  //console.dir(meta.middleware);
  //console.dir(custom);

  modifiers = modifiers.concat(custom);

  //console.dir(modifiers);

  run.call(this, tokens, meta, modifiers, function(err) {
    if(err) return callback(err);

    // prepend toc
    tokens = toctok.concat(tokens);
    if(gentok) {
      tokens = tokens.concat(gentok);
    }
    // links must be re-assigned after all concat calls
    tokens.links = links;

    // get an updated string representation of the document
    markdown = stringify(tokens);
    callback(null, {markdown: markdown, tokens: tokens});
  });
}
