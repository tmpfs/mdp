Table of Contents
=================

* [mdp(1)](#mdp1)
  * [Features](#features)
  * [Install](#install)
  * [Usage](#usage)
  * [Configuration](#configuration)
  * [Meta](#meta)
    * [Options](#options)
    * [Partial](#partial)
      * [Partial Literal](#partial-literal)
      * [Partial Reference](#partial-reference)
      * [Partial Object](#partial-object)
      * [Partial Include](#partial-include)
      * [Partial Binary](#partial-binary)
      * [Partial Require](#partial-require)
    * [Generator](#generator)
  * [Middleware](#middleware)
  * [Hook](#hook)
  * [License](#license)

mdp(1)
======

Markdown partial processor.

Designed to generate markdown documents from a series of partials. 

Read [partial](#partial) to learn how to define partials or get a quick feel by checking the [configuration](#configuration) that created this document, see [usage](#usage) for an abbreviated look at the command line options.

## Features

* Synchronize your `README` with your code.
* Generate `markdown`, `html`, `man` and `txt` documents from partials.
* Flexible middleware design, see [middleware](#middleware).
* Generate a table of contents for markdown document(s).
* Concatenate multiple markdown documents into a single file.
* Include the output of a shell program, great for examples or program usage.
* Convert relative links to absolute links so your readme documents work when displayed on the [npm](http://npmjs.org) website.
* Be pedantic in presentation, but lazy authoring. Ensure paragraphs are terminated with a period and start out title case.

## Install

```
npm i -g mdp
```

## Usage

```
Markdown partial processor.

Usage: mdp [-vfh] [--color|--no-color] [--debug] [-v|--verbose]
           [-f|--force] [--pandoc] [--inspect]
           [--pedantic|--no-pedantic] [--toc|--no-toc] [-h|--help]
           [--version] [--log-level=<level>] [--log-file=<file>]
           [--section=<1-8>] [-n|--filename=<name>]
           [--toc-title=<title>] [-p|--print=<format>]
           [--timeout=<ms>] [-t|--title=<title>]
           [-i|--input=<file...>] [-o|--output=<file...>]
           [-w|--middleware=<file...>] <args>

Options:
     --[no]-pedantic        Enable or disable pedantic middleware.
     --[no]-color           Enable or disable terminal colors.
     --log-file=[file]      Redirect to log file.
     --debug                Enable debugging.
 -v, --verbose              Print more information.
 -f, --force                Force file overwrite.
     --pandoc               Include pandoc meta data.
     --inspect              Enable inspect middleware.
     --section=[1-8]        Set the man page section.
 -n, --filename=[name]      Set the output file name.
     --log-level=[level]    Set the log level.
     --[no]-toc             Enable or disable the table of contents middleware,
                            this overrides a toc value in the meta data.
     --toc-title=[title]    Set the title for the table of contents, this
                            overrides --no-toc and the toc meta data property.
 -p, --print=[format]       Print document to stdout.
     --timeout=[ms]         Millisecond timeout for middleware.
 -t, --title=[title]        Document title.
 -i, --input=[file...]      Meta definition file(s).
 -o, --output=[file...]     Output file(s), may be specified once for each
                            format. The output format is determined by the file
                            extension, md, txt, html, xhtml or [1-8]. If no
                            output files are specified then README.md is
                            generated in the current directory. If the output
                            path is a directory then a file is created for each
                            supported format.
 -w, --middleware=[file...] Require custom middleware.
 -h, --help                 Display this help and exit.
     --version              Output version information and exit.

Examples:
 mdp --force                Generate README.md from package.json, overwriting
                            the file if it already exists.
 mdp --toc                  Include a table of contents.
 mdp --no-toc               Disable table of contents (overrides meta data).
 mdp --toc-title Navigation Enables the toc middleware and sets the title for
                            the table of contents.
 mdp --force --pandoc       Generate README.md with pandoc meta data prepended.

Report bugs to muji <noop@xpm.io>.
```

The program help output is also available as markdown see [MANUAL](https://github.com/freeformsystems/mdp/blob/master/MANUAL.md).

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
      "type": "code",
      "footer": "The program help output is also available as markdown see [MANUAL](/MANUAL.md)"
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
      "title": "Hook",
      "text": "Keep your README up to date with a git hook, this is the `pre-commit` hook from this repository:",
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
```

***Note this is not necessarily the optimal configuration it is designed to showcase the partial functionality.***

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
* `level`: An integer indicating the header level for `title` properties in partial definitions.
* `partial`: Array of partial definitions, see [partial](#partial).

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

### Partial

A partial may be one of:

* `literal|lit`: A string literal.
* `reference|ref`: A property reference.
* `object|obj`: A json or javascript object reference.
* `include|inc`: Include a file, normally a markdown document but not necessarily.
* `binary|bin`: Execute a command and use `stdout` as the content.
* `require|req`: Require a `.js` module or a `.json` file.

#### Partial Literal

At it's simplest a partial may be a string that contains markdown text.

#### Partial Reference

A reference to a property in the meta definition file. This is useful when you are embedding the partial definition in `package.json` and wish to reference the existing meta data such as `name` or `description`.

#### Partial Object

A reference to an object or a json object definition.

#### Partial Include

Include a file as a partial. Files are resolved relative to the `include` configuration directory, if the `include` configuration property is not set they are resolved relative to the current working directory. Typically this is a markdown document to include literally, but can also be used to wrap other files in markdown code blocks, useful for examples.

#### Partial Binary

Execute a command and include the command's `stdout` in the resulting document. If the command prints markdown then you can use that output, otherwise you can wrap the command's output as a markdown element of just include is literally. This is particularly useful when you want to include a program's help (`--help`) output as a usage section within a README.

#### Partial Require

Require a `js` module or a `json` file. Files are resolved relative to the `require` configuration directory, if the `require` configuration property is not set they are resolved relative to the current working directory.

### Generator

By default `mdp(1)` will append a *generator* message to the end of the document, it is nice if you wish to leave it in to help spread the word, however you may disable this message by setting the `generator` property to `false`.

## Middleware

Middleware functions are executed asynchronously once for each token encountered in the markdown document.

Implementations are passed a `meta` object which is the merged result of processing all the input configuration files (`--input`) and should return a closure that will be invoked once for each token in the document.

The closure function *must* be a named function and should return when zero arguments are passed so that function names may be used within error messages. It is passed the arguments:

* `token`: The current token being processed.
* `tokens`: The list of all tokens in the document, you may use `tokens.peek()` to look ahead but you should not modify the array.
* `next`: A callback to invoke when the token has been processed, signature is: `next(err)`.

If you pass an error to next the program will terminate immediately, failure to invoke `next()` will result in an error after a timeout (`--timeout`) has been exceeded.

The `inspect` middleware is shown below:

```javascript
function middleware(meta) {
  return function inspect(token, tokens, next) {
    if(!arguments.length) return;
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

## Hook

Keep your README up to date with a git hook, this is the `pre-commit` hook from this repository:

```bash
#!/bin/sh
cd ${GIT_DIR}/.. && npm run manual && git add -f MANUAL.md \
  && npm run build && npm install -g \
  && git add -f README.md doc/alt/README.*
```

If you have `mdp` in your path you could use:

```bash
#/bin/sh
cd ${GIT_DIR}/.. mdp --force && git add -f README.md
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/freeformsystems/mdp/blob/master/LICENSE) if you feel inclined.

This program was built using the [command](https://github.com/freeformsystems/cli-command) module, if you care for excellent documentation and write command line interfaces you should check it out.

Generated by [mdp(1)](https://github.com/freeformsystems/mdp).

[github]: http://github.com
[node]: http://nodejs.org
[npm]: http://npmjs.org
[marked]: https://github.com/chjj/marked
[command]: https://github.com/freeformsystems/cli-command
