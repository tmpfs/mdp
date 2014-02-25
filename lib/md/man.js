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
  pp: '.PP' + EOL + '%s' + EOL,
  tp: '.TP' + EOL,
  fb: '\\fB',
  fr: '\\fR',
  lt: '.LT' + EOL + '%s' + EOL,
  bl: '.BL' + EOL,
  it: '.IP "\\[ci]" 4' + EOL + '%s' + EOL,
  el: '.EL' + EOL,
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
  return EOL + '' + util.format(elements.lt, escape(code));
};

Renderer.prototype.blockquote = function(quote) {
  return '.TP' + EOL + escape(quote);
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

// span level renderer
Renderer.prototype.strong = function(text) {
  return elements.fb + escape(text) + elements.fr;
};

Renderer.prototype.em = function(text) {
  return text;
};

Renderer.prototype.codespan = function(text) {
  return elements.fb + escape(text) + elements.fr;
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
