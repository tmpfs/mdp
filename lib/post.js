var marked = require('marked');
var utils = require('cli-util');
var repeat = utils.repeat;

var stringify = require('./stringify');
var toc = require('./toc');
var inline = require('./links').inline;
var absolute = require('./links').absolute;

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
  if(!base && !usetoc) return callback(
    null, {markdown: markdown, tokens: lexer.lex(markdown)});
  // list of tokens for the table of contents
  var toctok = [];
  var tokens = lexer.lex(markdown);
  // make links absolute
  var links = tokens.links;
  absolute(links, base);
  var modifiers = [];
  if(usetoc) modifiers.push(toc(meta, toctok, base, usetoc));
  if(base) modifiers.push(inline);
  modify(tokens, modifiers);
  tokens = toctok.concat(tokens);
  tokens.links = links;
  markdown = stringify(tokens);
  callback(null, {markdown: markdown, tokens: tokens});
}
