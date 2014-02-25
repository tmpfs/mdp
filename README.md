Table of Contents
=================

* [mdp(1)](#mdp1)
  * [Features](#features)
  * [Install](#install)
  * [Usage](#usage)
  * [Configuration](#configuration)
  * [Defaults](#defaults)
  * [Meta](#meta)
    * [Options](#options)
    * [Partial](#partial)
    * [Generator](#generator)
  * [Middleware](#middleware)
  * [Library](#library)
  * [Hook](#hook)
  * [License](#license)

mdp(1)
======

Markdown partial processor.

Designed to generate markdown documents from a series of partials. 

Read [partial](#partial) to learn how to define partials or get a quick feel by checking the [configuration](#configuration) that created this document, see [usage](#usage) for an abbreviated look at the command line options.

Use this program to:

1. Concatenate multiple markdown documents into a single file.
2. Generate a table of contents for markdown document(s).
3. Include the output of a shell program, great for examples or program usage.
4. Keep your readme in sync with your code and prevent redundant effort with code samples.
5. Convert relative links to absolute links so your readme documents work when displayed on the [npm](http://npmjs.org) website.
6. Be pedantic in presentation, but lazy authoring. Ensure paragraphs are terminated with a period and start out title case.
7. Convert markdown document(s) to plain text.
8. Create arbitrary processing rules with custom middleware, see [middleware](#middleware).

This program was built using the [command](https://github.com/freeformsystems/cli-command) module:

> Command execution for command line interfaces, a component of the toolkit.

If you care for excellent documentation and write command line interfaces you should check it out.

## Features

* Synchronize your `README` with your code.
* Generate `markdown`, `html` and `txt` documents from partials.
* Flexible middlware design, see [middleware](#middleware)

## Install

```
npm i -g mdp
```

## Usage

```
Markdown partial processor.

Usage: mdp [-fp] [--force] [--print] [-o=file] [-h=file] file ...

Options:
 -t, --title=[title]  Document title.
     --color          Control terminal color.
 -f, --force          Force file overwrite.
     --pandoc         Include pandoc meta data.
     --inspect        Enable inspect middleware.
 -m, --md             Print markdown to stdout.
     --text           Use a text renderer, default output is README.txt.
     --man            Use a man renderer, default output is README.1.
     --debug          Enable debugging.
 -d, --metadata=[file...]
                      Meta definition file(s).
 -o, --output=[file]  Output file, default is README.md.
 -h, --html=[file]    Write html to file.
 -v, --verbose        Print more information.
 -w, --middleware=[file ...]
                      Require custom middleware.
     --help           Display this help and exit.
     --version        Output version information and exit.

Report bugs to muji <noop@xpm.io>.
```

## Configuration

This document was generated with the following configuration (see [package.json](https://github.com/freeformsystems/mdp/blob/master/package.json)):

```json
{
  "title": {
    "ref": "name",
    "format": "%s(1)"
  },
  "pedantic": true,
  "include": "doc/readme",
  "require": "lib",
  "gfm": true,
  "branch": "master",
  "links": "links.md",
  "toc": "Table of Contents",
  "order": false,
  "base": "https://github.com/freeformsystems/mdp",
  "partial": [
    {
      "ref": "description"
    },
    {
      "inc": [
        "introduction.md",
        "features.md",
        "install.md"
      ]
    },
    {
      "title": "Usage",
      "bin": "mdp --help",
      "type": "code"
    },
    {
      "title": "Configuration",
      "text": "This document was generated with the following configuration (see [package.json](/package.json)):",
      "ref": "mdp",
      "stringify": true,
      "format": "```json\n%s\n```",
      "footer": "***Note this is not necessarily the optimal configuration it is designed to showcase the partial functionality.***"
    },
    {
      "title": "Defaults",
      "req": "defaults.js",
      "type": "code",
      "language": "javascript"
    },
    {
      "inc": "meta.md"
    },
    {
      "title": "Middleware",
      "inc": "middleware.md"
    },
    {
      "text": "The `inspect` middleware is shown below:",
      "req": "middleware/inspect.js",
      "type": "code",
      "language": "javascript"
    },
    {
      "text": "You can enable it by declaring it in the meta data (or by using `--inspect`):",
      "obj": {
        "middleware": [
          "inspect"
        ]
      },
      "type": "code",
      "language": "json"
    },
    {
      "inc": [
        "library.md"
      ]
    },
    {
      "title": "Hook",
      "text": "Keep your README up to date with a git hook, this is the hook from this repository:",
      "inc": "../../.git/hooks/pre-commit",
      "type": "code",
      "language": "bash"
    },
    {
      "text": "If you have `mdp` in your path you could use:",
      "inc": "git-hook.sh",
      "type": "code",
      "language": "bash"
    },
    {
      "inc": [
        "license.md",
        "../../LICENSE"
      ]
    }
  ]
}
```

***Note this is not necessarily the optimal configuration it is designed to showcase the partial functionality.***

## Defaults

```javascript
{
  "generator": "Generated by [mdp(1)](https://github.com/freeformsystems/mdp).",
  "title": null,
  "gfm": true,
  "period": ".",
  "pedantic": false,
  "include": null,
  "require": null,
  "branch": "master",
  "links": null,
  "toc": false,
  "order": false,
  "base": null,
  "hash": false,
  "level": 2,
  "partial": null
}
```

## Meta

Meta data describes processing options and how you want to collate the partials.

### Options

* `generator`: A boolean that disables inclusion of the generator text.
* `title`: A string that sets the document title or a partial definition.
* `gfm`: A boolean that indicates that [github](http://github.com) flavoured markdown is in use.
* `period`: The character used by the [pedantic middleware](#pedantic-middleware).
* `include`: A directory that is the base path for [include partials](#include-partial).
* `require`: A directory that is the base path for [require partials](#require-partial).
* `branch`: A branch name to use when resolving links that begin with `/` for [github](http://github.com), only applicable if `gfm` is set.
* `links`: The name of a links include file, resolved relative to `include`.
* `toc`: Enable the table of contents middleware with `true` or set to a string to include a title above the table of contents.
* `order`: A boolean that indicates the `toc` middleware should use ordered lists.
* `base`: Enable the absolute link middleware, specifies the base URL for absolute links.
* `hash`: A boolean that controls whether the absolute middleware operates on URLs that begin with `#`.
* `level`: An integer indicating the header level for `title` properties in partial definitions, default is `2`.
* `partial`: Array of partial definitions, see [partial](#partial).

### Partial

A partial may be one of:

* `literal`: A string literal.
* `reference`: A property reference.
* `object`: A json or javascript object reference.
* `include`: Include a file, normally a markdown document but not necessarily.
* `binary`: Execute a command and use `stdout` as the content.
* `require`: Require a `.js` module or a `.json` file.

All keys are available using a three character abbreviation, specifiying `bin` is equivalent to `binary`.

### Generator

By default `mdp(1)` will append a *generator* message to the end of the document, it is nice if you wish to leave it in to help spread the word, however you may disable this message by setting the `generator` property to `false`.

## Middleware

Middleware functions are executed asynchronously once for each token encountered in the markdown document.

The `inspect` middleware is shown below:

```javascript
function inspect(meta) {
  return function(token, tokens, meta, next) {
    console.dir(token);
    next();
  }
}
```

You can enable it by declaring it in the meta data (or by using `--inspect`):

```json
{
  "middleware": [
    "inspect"
  ]
}
```

## Library

Whilst designed to be used as a command line interface, in order to support ordered lists when round tripping the [marked](https://github.com/chjj/marked) tokens back to markdown it was necessary to extend the `Parser` and `Renderer` classes.

These are exposed via the `MarkdownParser` and `MarkdownRenderer` properties of the module.

## Hook

Keep your README up to date with a git hook, this is the hook from this repository:

```bash
#!/usr/bin/env bash
abspath=$(cd ${BASH_SOURCE[0]%/*} && echo $PWD);
abspath=$(dirname $(dirname ${abspath}));
${abspath}/bin/mdp --force --debug && git add README.md
```

If you have `mdp` in your path you could use:

```bash
#/bin/sh
mdp --force && git add README.md
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/mdp/blob/master/LICENSE) if you feel inclined.

The MIT License (MIT)

Copyright (c) 2014 Freeform Systems.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the &quot;Software&quot;), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[github]: http://github.com
[node]: http://nodejs.org
[npm]: http://npmjs.org
[marked]: https://github.com/chjj/marked
[command]: https://github.com/freeformsystems/cli-command
