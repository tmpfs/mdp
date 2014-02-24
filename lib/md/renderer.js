var EOL = require('os').EOL;
var repeat = require('cli-util').repeat;
var header = require('../header');
var links = require('../links');

var dnl = repeat(2, EOL);

function Renderer(options) {
  this.options = options || {};
  this.lists = [];
  this.depth = -1;
}

Renderer.prototype.code = function(code, lang, escaped) {
  return '```' + (lang || '') + EOL + code + EOL + '```' + dnl;
  //if (this.options.highlight) {
    //var out = this.options.highlight(code, lang);
    //if (out != null && out !== code) {
      //escaped = true;
      //code = out;
    //}
  //}

  //if (!lang) {
    //return '<pre><code>'
      //+ (escaped ? code : escape(code, true))
      //+ '\n</code></pre>';
  //}

  //return '<pre><code class="'
    //+ this.options.langPrefix
    //+ escape(lang, true)
    //+ '">'
    //+ (escaped ? code : escape(code, true))
    //+ '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  //return '<blockquote>\n' + quote + '</blockquote>\n';
  return '> ' + quote;
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  if(level == 1) return header(text) + dnl;
  return repeat(level, '#') + ' ' + text + dnl;
  //return '<h'
    //+ level
    //+ ' id="'
    //+ this.options.headerPrefix
    //+ raw.toLowerCase().replace(/[^\w]+/g, '-')
    //+ '">'
    //+ text
    //+ '</h'
    //+ level
    //+ '>\n';
};

Renderer.prototype.hr = function() {
  return repeat(80, '-');
};

Renderer.prototype.token = function(token, parser) {
  switch(token.type) {
    case 'list_start':
      if(this.previous && this.previous.type === 'list_end') {
        console.log('consecutive start');
        //this.depth--;
      }
      this.depth++;
      if(token.ordered && !this.lists[this.depth]) {
        console.log('start list at this.depth: %s', this.depth);
        this.lists[this.depth] = {counter: 0, ordered: token.ordered};
      }else if(token.ordered) {
      }
      break;
    case 'list_item_end':
      if(this.lists[this.depth]) this.lists[this.depth].counter++;
      break;
    case 'list_end':
      var next = parser.peek();
      console.log('end list: %s %s', this.depth, next.type);
      // not a consecutive list
      if(next.type !== 'list_start') {
        // reset depth so that li elements for ul elements
        // are restored
        this.depth = -1;
        this.lists = [];
        this.previous = null;
      }else{
        //this.depth--;
      }
      break;
  }
  this.previous = token;
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
  console.log('list item %s', text);
  //console.dir(this.lists[this.depth].counter);
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
  //return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '*' + text + '*';
};

Renderer.prototype.codespan = function(text) {
  return '`' + text + '`';
};

Renderer.prototype.br = function() {
  //return this.options.xhtml ? '<br/>' : '<br>';
  return EOL;
};

Renderer.prototype.del = function(text) {
  //return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  return links.stringify(text, href, title);
  //if (this.options.sanitize) {
    //try {
      //var prot = decodeURIComponent(unescape(href))
        //.replace(/[^\w:]/g, '')
        //.toLowerCase();
    //} catch (e) {
      //return '';
    //}
    //if (prot.indexOf('javascript:') === 0) {
      //return '';
    //}
  //}
  //var out = '<a href="' + href + '"';
  //if (title) {
    //out += ' title="' + title + '"';
  //}
  //out += '>' + text + '</a>';
  //return out;
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
