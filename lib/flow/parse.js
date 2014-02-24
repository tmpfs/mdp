var marked = require('marked');
var utils = require('cli-util');
var repeat = utils.repeat;

var generator = require('../util/generator');
var footer = require('../util/footer');
var modify = require('../modify');
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
function exec(tokens, modifiers) {
  function run(token, tokens) {
    modifiers.forEach(function(func) {
      func(token, tokens);
    });
  }
  for(var i = 0;i < tokens.length;i++) {
    run(tokens[i], tokens);
  }
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

  // nothing to be done - shortcut out
  if(!meta.base && !meta.toc && !meta.pedantic) {
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
    modifiers.push(modify.toc(meta, toctok, meta.toc));
  }
  if(meta.base) modifiers.push(modify.absolute(meta));
  exec(tokens, modifiers);

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
}
