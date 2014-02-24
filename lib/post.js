var marked = require('marked');
var utils = require('cli-util');
var repeat = utils.repeat;

var stringify = require('./stringify');
var toc = require('./modify/toc');
var inline = require('./modify/absolute');
var absolute = require('./links').absolute;
var generator = require('./util/generator');

/**
 *  @func modify(tokens, [modifiers])
 *
 *  @api private
 *
 *  Modifies the token list.
 *
 *  @param tokens The lexer tokens.
 *  @param modifiers An array of modifier functions.
 */
function modify(tokens, modifiers) {
  modifiers = modifiers || [];
  function modify(token, tokens) {
    modifiers.forEach(function(func) {
      func(token, tokens);
    });
  }
  for(var i = 0;i < tokens.length;i++) {
    modify(tokens[i], tokens);
  }
}

/**
 *  @func (meta, markdown, callback)
 *
 *  Post process the generated markdown document.
 *
 *  @param meta The meta data.
 *  @param markdown The markdown document.
 *  @param callback A callback function.
 */
module.exports = function post(meta, markdown, callback) {
  var lexer = new marked.Lexer(meta.marked);
  var base = meta && meta.base ?
    meta.base : meta.base;
  var usetoc = meta && meta.toc ?
    meta.toc : meta.toc;
  var tokens = lexer.lex(markdown);
  var gentok;
  if(meta.generator) {
    gentok = generator(meta);
  }
  if(!base && !usetoc) return callback(
    null, {markdown: markdown, tokens: tokens.concat(gentok)});
  // list of tokens for the table of contents
  var toctok = [];
  // make links absolute
  var links = tokens.links;
  absolute(meta, links);
  var modifiers = [];
  if(usetoc) modifiers.push(toc(meta, toctok, base, usetoc));
  if(base) modifiers.push(inline(meta));
  // process links and toc
  modify(tokens, modifiers);
  // prepend toc
  tokens = toctok.concat(tokens);
  if(gentok) {
    tokens = tokens.concat(gentok);
  }
  // links must be re-assigned after all concat calls
  tokens.links = links;
  markdown = stringify(tokens);
  callback(null, {markdown: markdown, tokens: tokens});
}
