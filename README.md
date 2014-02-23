rdm(1)
======

Markdown partial generator (readme).

Designed to generate markdown documents from a series of partials. Partials are defined within a `readme` section of `package.json`.

A partial may be one of:

* `string`: A string literal.
* `property`: A property reference.
* `include`: Include a markdown file.
* `script`: Script execution.

## Install

```
npm install rdm
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
  "links": "links.md",
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
      "include": "links.md"
    }
  ]
}
```

## Usage

```
Generate markdown documents from partials.

Designed for readme documents but may be used for any markdown document.

Usage: rdm [-fp] [--force] [--print] [-o=FILE]

Options:
 -f, --force        Force overwrite.
 -p, --print        Print to stdout.
 -o, --output       Output file, default is README.md in the working directory.
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
rdm [-fp] [--force] [--print] [-o=FILE]
```

### Options

* `-f, --force`: Force overwrite.
* `-p, --print`: Print to stdout.
* `-o, --output`: Output file, default is README.md in the working directory.
* `    --color`: Control terminal color.
* `    --debug`: Enable debugging.
* `    --help`: Display this help and exit.
* `    --version`: Output version information and exit.

### Bugs

Report bugs to muji <noop@xpm.io>.

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.

