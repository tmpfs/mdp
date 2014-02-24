var EOL = require('os').EOL;
var repeat = require('cli-util').repeat;
var header = require('../header');
var links = require('../links');

var dnl = repeat(2, EOL);
function nl(eol) {
  eol = eol || EOL;
  //parts.push(eol);
}

function Renderer(options) {
  this.options = options || {};
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
  //console.dir(token);
  switch(token.type) {
    case 'list_start':
      //if(depth > 0 && previous && previous.type === 'list_end') {
        //depth--;
      //}else{
      //}
      //depth++;
      //console.log('start list at depth: %s', depth);
      //console.dir(lists[depth]);
      //lists[depth] = {
        //counter: lists[depth] ? lists[depth].counter : 1,
        //ordered: token.ordered};
      //li = !token.ordered ? '*' : lists[depth].counter + '.';
      break;
    case 'list_item_start':
      //if(lists[depth].ordered) li = lists[depth].counter + '.';
      //padding = token.indent ? repeat(token.indent * 2) : '';
      //// TODO: gobble everything upto list_item_end
      //++i; token = tokens[i];
      var tkn = parser.peek();
      console.log('list item %s', tkn.text);
      //if(!lists[depth].start) lists[depth].start = token.text;
      //if(token) parts.push(padding + li + ' ' + token.text);
      break;
    case 'list_item_end':
      //lists[depth].counter++;
      //nl();
      break;
    case 'list_end':
      //if(!token.toc) nl();
      console.log('end list: %s', token.type);
      //li = null;
      //// consecutive list
      //if(tokens[i + 1] && tokens[i + 1].type !== 'list_start') {
        //if(depth > 0) lists.pop();
        //console.dir(lists.length);
        //console.dir(lists)
        //depth--;
      //}
      break;
  }
}

Renderer.prototype.list = function(body, ordered, next) {
  return body + (next.type !== 'list_start' ? EOL : '');
};

Renderer.prototype.listitem = function(text, start, end, ordered) {
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
