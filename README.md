Table of Contents
=================

* [rdm(1)](https://github.com/freeformsystems/rdm#rdm1)
  * [Install](https://github.com/freeformsystems/rdm#install)
  * [Test](https://github.com/freeformsystems/rdm#test)
  * [Configuration](https://github.com/freeformsystems/rdm#configuration)
  * [Usage](https://github.com/freeformsystems/rdm#usage)
  * [Manual](https://github.com/freeformsystems/rdm#manual)
    * [Usage](https://github.com/freeformsystems/rdm#usage)
    * [Options](https://github.com/freeformsystems/rdm#options)
    * [Bugs](https://github.com/freeformsystems/rdm#bugs)
  * [License](https://github.com/freeformsystems/rdm#license)

rdm(1)
======

Markdown partial processor.

Designed to generate markdown documents from a series of partials. Partials are defined within a `readme` section of `package.json` or may be loaded from any `json` or [node][node] `js` file.

A partial may be one of:

* `string`: A string literal.
* `property`: A property reference.
* `include`: Include a file, normally a markdown document but not necessarily.
* `script`: Execute a command and use `stdout` as the content.
* `require`: Require a `.js` module or a `.json` file.

See [usage](https://github.com/freeformsystems/rdm#usage) for command line options, the [manual](https://github.com/freeformsystems/rdm#manual) section illustrates the result of running an executable with a specific environment configuration, see [configuration](https://github.com/freeformsystems/rdm#configuration).

This program was built using the [command][command] module, if you care for excellent documentation and write command line interfaces you should check it out.

## Install

```
npm i -g rdm
```

## Test

```
npm test
```

## Configuration

This document was generated with the following configuration:

```json
{
  "title": "rdm(1)",
  "pedantic": true,
  "includes": "readme",
  "gfm": true,
  "branch": "master",
  "links": "links.md",
  "toc": "Table of Contents",
  "base": "https://github.com/freeformsystems/rdm",
  "partial": [
    {
      "property": "description"
    },
    {
      "include": "introduction.md"
    },
    {
      "include": "install.md"
    },
    {
      "include": "test.md"
    },
    "## Configuration\n\nThis document was generated with the following configuration:",
    {
      "property": "readme",
      "stringify": true,
      "format": "```json\n%s\n```"
    },
    "## Usage",
    {
      "script": "rdm --help",
      "type": "pre",
      "format": "```\n%s\n```"
    },
    "## Manual",
    {
      "env": {
        "cli_toolkit_help_style": "markdown",
        "cli_toolkit_help_markdown_title": true,
        "cli_toolkit_help_markdown_header": "###"
      },
      "script": "rdm --help",
      "pedantic": false
    },
    {
      "include": "license.md"
    },
    {
      "comment": "Includes path is set to *readme* so drop down a directory",
      "include": "../LICENSE"
    },
    {
      "include": "links.md"
    }
  ]
}
```

## Usage

```
Generate markdown documents from partials.

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

Generate markdown documents from partials.

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
* `    --color`: Control terminal color.
* `    --debug`: Enable debugging.
* `    --help`: Display this help and exit.
* `    --version`: Output version information and exit.

### Bugs

Report bugs to muji <noop@xpm.io>.

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/rdm/blob/master/LICENSE) if you feel inclined.

The MIT License (MIT)

Copyright (c) 2014 Freeform Systems

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[node]: http://nodejs.org
[command]: https://github.com/freeformsystems/cli-command
[usage]: https://github.com/freeformsystems/rdm#usage.
