var EOL = require('os').EOL;
var util = require('util');
var MarkdownRenderer = require('./renderer');
var repeat = require('cli-util').repeat;
var dnl = EOL + EOL;

function Renderer(options) {
  MarkdownRenderer.apply(this, arguments);
  this.links = [];
  this.hrefs = [];
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
  return repeat(level, '#') + ' ' + text + dnl;
};

Renderer.prototype.hr = function() {
  return repeat(80, '-');
};

Renderer.prototype.list = function(body, ordered, next) {
  return body + (next.type !== 'list_start' ? EOL : '');
};

Renderer.prototype.listitem = function(text, start, end) {
  text = this.ref(text);
  var padding = start.indent ? repeat(start.indent * 2) : '';
  return padding + '* ' + text + EOL;
};

Renderer.prototype.paragraph = function(text) {
  text = this.ref(text);
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

Renderer.prototype.addLink = function(href, title, text) {
  if(/[a-zA-Z0-9]:\/\//.test(href)) {
    var index = this.hrefs.indexOf(href)
    if(!~index) {
      this.hrefs.push(href);
      this.links.push({href: href, title: title, text: text});
      index = this.links.length;
    }else{
      ++index;
    }
    return text + '[' + index + ']';
  }
  return text;
}

Renderer.prototype.ref = function(text) {
  var re = /\[([^\]]+)\]\[([^\]]*)\]/g, result, txt, href, start, end;
  while(result = re.exec(text)) {
    txt = result[1]; href = result[2];
    start = text.substr(0, result.index);
    end = text.substr(result.index + result[0].length);
    //console.dir('got link ref:' + txt);
    //console.dir(text);
    //console.dir(start);
    text = start + this.addLink(href, null, txt) + end;
  }
  return text;
}

Renderer.prototype.href = function(href, title, text) {
  return this.addLink(href, title, text);
}

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
  // TODO: wrap emails in <>
  href = href.replace(/^mailto:/, '');
  return this.href(href, title, text);
};

Renderer.prototype.tokens = function(tokens) {
  for(var z in tokens.links) {
    this.addLink(tokens.links[z].href, tokens.links[z].title, z);
  }
}

Renderer.prototype.image = function(href, title, text) {
  return text;
};

Renderer.prototype.getLinks = function() {
  var tokens = [];
  if(this.links.length) {
    tokens.push(
      {type: 'heading', text: 'Links', level: 2},
      {type: 'list_start'});
    var i, text;
    for(i = 0;i < this.links.length;i++) {
      text = '[' + (i+1) + '] ' + this.links[i].href;
      tokens.push({type: 'list_item_start'});
      tokens.push({type: 'text', text: text});
      tokens.push({type: 'list_item_end'});
    }
    tokens.push({type: 'list_end'});
  }
  return tokens;
}

module.exports = Renderer;
