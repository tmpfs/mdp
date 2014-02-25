var util = require('util');
var marked = require('marked');
var MarkedParser = marked.Parser;
var TextRenderer = require('./text');
var ManualRenderer = require('./man');
var InlineLexer = marked.InlineLexer;

/**
 * Parsing & Compiling
 */
function Parser(options) {
  MarkedParser.apply(this, arguments);
  this.renderer.parser = this;
}

util.inherits(Parser, MarkedParser);

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.renderer.tokens(src);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */
Parser.prototype.next = function() {
  this.token = this.tokens.pop();
  if(this.token) this.renderer.token(this.token, this);
  return this.token;
};

/**
 * Parse Current Token
 */
Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered, this.peek());
    }
    case 'list_item_start': {
      var body = '', start = this.token;

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body, start, this.token);
    }
    default:
      return MarkedParser.prototype.tok.apply(this, arguments);
  }
};

module.exports = Parser;
