var EOL = require('os').EOL;
var SPACE = ' ';
var util = require('util');
var MarkdownRenderer = require('./text');
var repeat = require('cli-util').repeat;
var dnl = EOL + EOL;

var elements = {
  th: '.TH "%s" "%s" "%s" "%s" "%s"' + EOL,
  sh: '.SH "%s"' + EOL,
  ss: '.SS "%s"' + EOL,
  b: '.B' + SPACE,
  tp: '.TP' + EOL + '%s' + EOL,
  comment: '.\\" %s' + EOL
}

function escape(text) {
  text = text.replace(/-/g, '\\-');
  return text;
}

function Renderer(options) {
  MarkdownRenderer.apply(this, arguments);
}

util.inherits(Renderer, MarkdownRenderer);

Renderer.prototype.code = function(code, lang, escaped) {
  return code + dnl;
};

Renderer.prototype.blockquote = function(quote) {
  return quote;
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  level = level || 1;
  level = Math.min(level, 2);
  var elem = level == 1 ? elements.sh : elements.ss;
  if(level === 1) text = text.toUpperCase();
  return util.format(elem, escape(text));
};

Renderer.prototype.hr = function() {
  //return repeat(80, '-');
};

Renderer.prototype.list = function(body, ordered, next) {
  return body + (next.type !== 'list_start' ? EOL : '');
};

Renderer.prototype.listitem = function(text, start, end) {
  var padding = start.indent ? repeat(start.indent * 2) : '';
  return padding + '* ' + text + EOL;
};

Renderer.prototype.paragraph = function(text) {
  return text + dnl;
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

// span level renderer
Renderer.prototype.strong = function(text) {
  return text;
};

Renderer.prototype.em = function(text) {
  return text;
};

Renderer.prototype.codespan = function(text) {
  return text;
};

Renderer.prototype.br = function() {
  return EOL;
};

Renderer.prototype.del = function(text) {
  return text;
};

Renderer.prototype.link = function(href, title, text) {
  if(this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0) {
      return '';
    }
  }
  return href;
};

Renderer.prototype.image = function(href, title, text) {
  return text;
};

module.exports = Renderer;
module.exports.escape = escape;
module.exports.elements = elements;
