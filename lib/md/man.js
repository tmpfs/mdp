var EOL = require('os').EOL;
var util = require('util');
var TextRenderer = require('./text');
var repeat = require('cli-util').repeat;
var dnl = EOL + EOL;

var elements = require('../man').elements;
var escape = require('../man').sanitize;

function Renderer(options) {
  TextRenderer.apply(this, arguments);
}

util.inherits(Renderer, TextRenderer);

Renderer.prototype.code = function(code, lang, escaped) {
  var single = !/\n/.test(code);
  if(single) {
    // single line code blocks are bold
    return EOL +  elements.fb + escape(code) + elements.fr + EOL;
  }
  return EOL + util.format(elements.lt, escape(code));
};

Renderer.prototype.blockquote = function(quote) {
  // TODO: remove formatting from child elements
  return elements.tp + escape(quote);
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  level = level || 1;
  level = Math.min(level, 3);
  var sh = level == 1 || level == 2;
  var elem = sh ? elements.sh : elements.ss;
  if(sh) text = text.toUpperCase();
  return util.format(elem, escape(text));
};

Renderer.prototype.hr = function() {
  //return repeat(80, '-');
};

Renderer.prototype.list = function(body, ordered, next) {
  return elements.bl + body + elements.el;
};

Renderer.prototype.listitem = function(text, start, end) {
  return util.format(elements.it, escape(text));
};

Renderer.prototype.paragraph = function(text) {
  return util.format(elements.pp, escape(text));
};

Renderer.prototype.table = function(header, body) {
  //return '<table>\n'
    //+ '<thead>\n'
    //+ header
    //+ '</thead>\n'
    //+ '<tbody>\n'
    //+ body
    //+ '</tbody>\n'
    //+ '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  //return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  //var type = flags.header ? 'th' : 'td';
  //var tag = flags.align
    //? '<' + type + ' style="text-align:' + flags.align + '">'
    //: '<' + type + '>';
  //return tag + content + '</' + type + '>\n';
};

Renderer.prototype.href = function(href, title, text) {
  // sadly no easy way to tell if the link references a
  // SH or SS otherwise we would use title case for SS
  if(/^#/.test(href)) {
    text = text.toUpperCase();
    return this.strong(text);
  }
  return TextRenderer.prototype.href.apply(this, arguments);
}

// span level renderer
Renderer.prototype.strong = function(text) {
  return elements.fb + escape(text) + elements.fr;
};

Renderer.prototype.em = function(text) {
  // only underline simple terms
  if(/ /.test(text)) return escape(text);
  return elements.fi + escape(text) + elements.fr;
};

Renderer.prototype.codespan = function(text) {
  return elements.fb + text + elements.fr;
};

Renderer.prototype.br = function() {
  return EOL;
};

Renderer.prototype.del = function(text) {
  return text;
};

Renderer.prototype.image = function(href, title, text) {
  return text;
};

module.exports = Renderer;
module.exports.escape = escape;
module.exports.elements = elements;
