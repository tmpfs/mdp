Table of Contents
=================

* [rdm(1)](https://github.com/freeformsystems/rdm#rdm1)
  * [Configuration](https://github.com/freeformsystems/rdm#configuration)
  * [Partial](https://github.com/freeformsystems/rdm#partial)
  * [Usage](https://github.com/freeformsystems/rdm#usage)
  * [Manual](https://github.com/freeformsystems/rdm#manual)
    * [Usage](https://github.com/freeformsystems/rdm#usage)
    * [Options](https://github.com/freeformsystems/rdm#options)
    * [Bugs](https://github.com/freeformsystems/rdm#bugs)
  * [License](https://github.com/freeformsystems/rdm#license)

rdm(1)
======

Markdown partial processor.

```
npm i -g rdm
```

Designed to generate markdown documents from a series of partials. 

Read [partials](https://github.com/freeformsystems/rdm#partials) to learn how to define partials or get a quick feel by checking the [configuration](https://github.com/freeformsystems/rdm#configuration) that created this document, see [usage](https://github.com/freeformsystems/rdm#usage) for an abbreviated look at the command line options, the [manual](https://github.com/freeformsystems/rdm#manual) section is the result of generating program help for `rdm(1)` as markdown it illustrates the result of running an executable with a specific environment configuration.

Use this program to:

1. Concatenate multiple markdown documents into a single file.
2. Generate a table of contents for markdown document(s).
3. Include the output of a shell program, great for examples or program usage.
4. Keep your readme in sync with your code and prevent redundant effort with code samples.
5. Convert relative links to absolute links so your readme documents work when displayed on the [npm](http://npmjs.org) website.

This program was built using the [command](https://github.com/freeformsystems/cli-command) module:

> Command execution for command line interfaces, a component of the toolkit.

If you care for excellent documentation and write command line interfaces you should check it out.

## Configuration

This document was generated with the following configuration (see [package.json](https://github.com/freeformsystems/rdm/blob/master/package.json)):

## Partial

A partial may be one of:

* `string`: A markdown string literal.
* `property`: A property reference.
* `include`: Include a file, normally a markdown document but not necessarily.
* `script`: Execute a command and use `stdout` as the content.
* `require`: Require a `.js` module or a `.json` file.

## Usage

```
Markdown partial processor.

Designed for readme documents but may be used for any markdown document.

Usage: rdm [-fp] [--force] [--print] [-o=file] [-h=file] file ...

Options:
 -f, --force        Force overwrite.
 -p, --print        Print to stdout.
 -t, --title=[title]
                    Document title.
 -o, --output=[file]
                    Markdown output file, default is README.md in the working
                    directory.
 -h, --html=[file]  Write html to file.
     --color        Control terminal color.
     --debug        Enable debugging.
     --help         Display this help and exit.
     --version      Output version information and exit.

Report bugs to muji <noop@xpm.io>.
```

## Manual

Markdown partial processor.

Designed for readme documents but may be used for any markdown document.

### Usage

```
rdm [-fp] [--force] [--print] [-o=file] [-h=file] file ...
```

### Options

* `-f, --force`: Force overwrite.
* `-p, --print`: Print to stdout.
* `-t, --title=[title]`: Document title.
* `-o, --output=[file]`: Markdown output file, default is README.md in the working directory.
* `-h, --html=[file]`: Write html to file.
* `--color`: Control terminal color.
* `--debug`: Enable debugging.
* `--help`: Display this help and exit.
* `--version`: Output version information and exit.

### Bugs

Report bugs to muji [&#x6e;&#111;&#111;&#112;&#x40;&#120;&#x70;&#109;&#x2e;&#105;&#x6f;](&#x6d;&#x61;&#105;&#108;&#x74;&#x6f;&#58;&#x6e;&#111;&#111;&#112;&#x40;&#120;&#x70;&#109;&#x2e;&#105;&#x6f;).

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/rdm/blob/master/LICENSE) if you feel inclined.

The MIT License (MIT)

Copyright (c) 2014 Freeform Systems

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

Generated by [rdm(1)](https://github.com/freeformsystems/rdm).

[node]: http://nodejs.org
[npm]: http://npmjs.org
[command]: https://github.com/freeformsystems/cli-command
[usage]: https://github.com/freeformsystems/rdm#usage.
