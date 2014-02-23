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
      "script": "./bin/rdm --help"
    }
  ]
}
```

## Usage

