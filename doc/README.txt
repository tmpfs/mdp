# Table of Contents

* mdp(1)
  * Features
  * Install
  * Usage
  * Configuration
  * Meta
    * Options
    * Partial
    * Generator
  * Middleware
  * Library
  * Hook
  * License

# mdp(1)

Markdown partial processor.

Designed to generate markdown documents from a series of partials. 

Read partial to learn how to define partials or get a quick feel by checking the configuration that created this document, see usage for an abbreviated look at the command line options.

## Features

* Synchronize your README with your code.
* Generate markdown, html, man and txt documents from partials.
* Flexible middleware design, see middleware.
* Generate a table of contents for markdown document(s).
* Concatenate multiple markdown documents into a single file.
* Include the output of a shell program, great for examples or program usage.
* Convert relative links to absolute links so your readme documents work when displayed on the npm[3] website.
* Be pedantic in presentation, but lazy authoring. Ensure paragraphs are terminated with a period and start out title case.

## Install

npm i -g mdp

## Usage

Markdown partial processor.

Usage: mdp [-fp] [--force] [--print] [-o=file] [-h=file] file ...

Options:
 -t, --title=[title]  Document title.
     --color          Control terminal color.
 -f, --force          Force file overwrite.
     --pandoc         Include pandoc meta data.
     --inspect        Enable inspect middleware.
 -p, --print=[format] Print document to stdout.
     --debug          Enable debugging.
 -i, --input=[file...]
                      Meta definition file(s).
 -o, --output=[file...]
                      Output file(s), default is README.md.
 -v, --verbose        Print more information.
 -w, --middleware=[file ...]
                      Require custom middleware.
     --help           Display this help and exit.
     --version        Output version information and exit.

Report bugs to muji <noop@xpm.io>.

## Configuration

This document was generated with the following configuration (see package.json[6]):

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
      "inc": "meta.md"
    },
    {
      "req": "defaults.js",
      "type": "code",
      "language": "javascript"
    },
    {
      "inc": [
        "partial.md",
        "generator.md"
      ]
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
        "footer.md"
      ]
    }
  ]
}

Note this is not necessarily the optimal configuration it is designed to showcase the partial functionality.

## Meta

Meta data describes processing options and how you want to collate the partials.

### Options

* generator: A boolean that disables inclusion of the generator text.
* title: A string that sets the document title or a partial definition.
* gfm: A boolean that indicates that github[1] flavoured markdown is in use.
* period: The character used by the pedantic middleware.
* include: A directory that is the base path for include partials.
* require: A directory that is the base path for require partials.
* branch: A branch name to use when resolving links that begin with / for github[1], only applicable if gfm is set.
* links: The name of a links include file, resolved relative to include.
* toc: Enable the table of contents middleware with true or set to a string to include a title above the table of contents.
* order: A boolean that indicates the toc middleware should use ordered lists.
* base: Enable the absolute link middleware, specifies the base URL for absolute links.
* hash: A boolean that controls whether the absolute middleware operates on URLs that begin with #.
* level: An integer indicating the header level for title properties in partial definitions.
* partial: Array of partial definitions, see partial.

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

### Partial

A partial may be one of:

* literal|lit: A string literal.
* reference|ref: A property reference.
* object|obj: A json or javascript object reference.
* include|inc: Include a file, normally a markdown document but not necessarily.
* binary|bin: Execute a command and use stdout as the content.
* require|req: Require a .js module or a .json file.

### Generator

By default mdp(1) will append a generator message to the end of the document, it is nice if you wish to leave it in to help spread the word, however you may disable this message by setting the generator property to false.

## Middleware

Middleware functions are executed asynchronously once for each token encountered in the markdown document.

The inspect middleware is shown below:

function inspect(meta) {
  return function(token, tokens, meta, next) {
    console.dir(token);
    next();
  }
}

You can enable it by declaring it in the meta data (or by using --inspect):

{
  "middleware": [
    "inspect"
  ]
}

## Library

Whilst designed to be used as a command line interface, in order to support ordered lists when round tripping the marked[4] tokens back to markdown it was necessary to extend the Parser and Renderer classes.

These are exposed via the MarkdownParser and MarkdownRenderer properties of the module.

## Hook

Keep your README up to date with a git hook, this is the hook from this repository:

#!/usr/bin/env bash
path=$(cd ${BASH_SOURCE[0]%/*} && echo $PWD);
path=$(dirname $(dirname ${path}));
cd ${path} && npm run build \
  && git add README.md doc/README.html doc/README.txt doc/README.1

If you have mdp in your path you could use:

#/bin/sh
mdp --force && git add README.md

## License

Everything is MIT[7]. Read the license[8] if you feel inclined.

This program was built using the command[5] module, if you care for excellent documentation and write command line interfaces you should check it out.

Generated by mdp(1)[9].

## Links

* [1] http://github.com
* [2] http://nodejs.org
* [3] http://npmjs.org
* [4] https://github.com/chjj/marked
* [5] https://github.com/freeformsystems/cli-command
* [6] https://github.com/freeformsystems/mdp/blob/master/package.json
* [7] http://en.wikipedia.org/wiki/MIT_License
* [8] https://github.com/freeformsystems/mdp/blob/master/LICENSE
* [9] https://github.com/freeformsystems/mdp

