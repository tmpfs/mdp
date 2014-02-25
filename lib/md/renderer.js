var EOL = require('os').EOL;
var util = require('util');
var marked = require('marked');
var MarkedRenderer = marked.Renderer;
var repeat = require('cli-util').repeat;
var header = require('../util/header');
var links = require('../util/links');

var dnl = repeat(2, EOL);

function Renderer(options) {
  MarkedRenderer.apply(this, arguments);
  this.lists = [];
  this.depth = -1;
}

util.inherits(Renderer, MarkedRenderer);

Renderer.prototype.code = function(code, lang, escaped) {
  return '```' + (lang || '') + EOL + code + EOL + '```' + dnl;
};

Renderer.prototype.blockquote = function(quote) {
  return '> ' + quote;
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  if(level == 1) return header(text) + dnl;
  return repeat(level, '#') + ' ' + text + dnl;
};

Renderer.prototype.hr = function() {
  return repeat(80, '-');
};

Renderer.prototype.token = function(token, parser) {
  switch(token.type) {
    case 'list_start':
      this.depth = token.depth - 1;
      if(token.ordered && !this.lists[this.depth]) {
        this.lists[this.depth] = {counter: 0, ordered: token.ordered};
      }
      break;
    case 'list_item_end':
      if(this.lists[this.depth]) this.lists[this.depth].counter++;
      break;
    case 'list_end':
      var next = parser.peek();
      // not a consecutive list
      if(next.type !== 'list_start') {
        // reset depth so that li elements for ul elements
        // are restored
        this.depth = -1;
        this.lists = [];
      }
      break;
  }
}

Renderer.prototype.end = function(parser) {}

Renderer.prototype.list = function(body, ordered, next) {
  return body + (next.type !== 'list_start' ? EOL : '');
};

Renderer.prototype.listitem = function(text, start, end) {
  var padding = start.indent ? repeat(start.indent * 2) : '';
  var li = '*';
  if(this.lists[this.depth]) {
    li = this.depth == -1 ? li : this.lists[this.depth].counter + '.';
  }
  return padding + li + ' ' + text + EOL;
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
  return '**' + text + '**';
};

Renderer.prototype.em = function(text) {
  return '*' + text + '*';
};

Renderer.prototype.codespan = function(text) {
  return '`' + text + '`';
};

Renderer.prototype.br = function() {
  return EOL;
};

Renderer.prototype.del = function(text) {
  //return '<del>' + text + '</del>';
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
  return links.anchor(text, href, title);
};

Renderer.prototype.image = function(href, title, text) {
  //var out = '<img src="' + href + '" alt="' + text + '"';
  //if (title) {
    //out += ' title="' + title + '"';
  //}
  //out += this.options.xhtml ? '/>' : '>';
  //return out;
};

module.exports = Renderer;
