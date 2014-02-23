rdm(1)
======

Markdown partial generator (readme).

Designed to generate markdown documents from a series of partials. Partials are defined within a `readme` section of `package.json`.

A partial may be one of:

* `string`: A string literal.
* `property`: A property reference.
* `include`: Include a markdown file.
* `script`: Script execution.

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
      "property": "readme",
      "stringify": true,
      "format": "```json\n%s\n```"
    },
    {
      "script": "./bin/rdm --help"
    }
  ]
}
```

