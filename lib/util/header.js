var EOL = require('os').EOL;
var repeat = require('cli-util').repeat;

/**
 *  @func header(token)
 *
 *  @api private
 *
 *  Create a header with underlying equals signs.
 *
 *  Makes visually recognizing h1 elements easier.
 *
 *  @param token The lexer token.
 *
 *  @return A header string.
 */
function header(text) {
  return text + EOL + repeat(text.length, '=');
}

module.exports = header;
