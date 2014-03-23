### Partial 

A partial may be one of:

* `literal|lit`: A string literal.
* `reference|ref`: A property reference.
* `object|obj`: A json or javascript object reference.
* `include|inc`: Include a file, normally a markdown document but not necessarily.
* `binary|bin`: Execute a command and use `stdout` as the content.
* `require|req`: Require a `.js` module or a `.json` file.

#### Literal

At it's simplest a partial may be a string that contains markdown text.

#### Reference

A reference to a property in the meta definition file. This is useful when you are embedding the partial definition in `package.json` and wish to reference the existing meta data such as `name` or `description`.

#### Object

A reference to an object or a json object definition.

#### Include

Include a file as a partial. Files are resolved relative to the `include` configuration directory, if the `include` configuration property is not set they are resolved relative to the current working directory. Typically this is a markdown document to include literally, but can also be used to wrap other files in markdown code blocks, useful for examples.

Note that when including files trailing whitespace is removed from the file contents before inclusion in the resulting document.

* `trim`: A boolean that when set to `false` disables the default behaviour of removing trailing whitespace from the file contents.

#### Binary

Execute a command and include the command's `stdout` in the resulting document. If the command prints markdown then you can use that output, otherwise you can wrap the command's output as a markdown element of just include is literally. This is particularly useful when you want to include a program's help (`--help`) output as a section within a document.

Binaries inherit the environment of the parent process (`mdp`) and the current working directory. The following fields are specific to the `binary` partial type:

* `stderr`: A boolean that indicates that the command `stderr` stream should be used instead of the `stdout` stream.
* `cmd`: A directory that becomes the working directory for the child process.
* `env`: An object containing properties to *append* to the environment for the child process.

#### Require

Require a `js` module or a `json` file. Files are resolved relative to the `require` configuration directory, if the `require` configuration property is not set they are resolved relative to the current working directory.

#### Fields

These are the common fields that apply to all partial types:

* `title`: Injects a markdown heading for the partial, by default this is a level 2 heading although you may adjust this with the `level` configuration property.
* `text`: Markdown text to inject after the title but before the partial content.
* `type`: A type that indicates how the partial content should be wrapped, eg: `code`.
* `language`: A language to assign when wrapping as a `code` block.
* `footer`: Markdown text to inject after the partial content.
* `stringify`: When referencing javascript objects (via `ref`, `req` etc.) this indicates that the result should be converted to `JSON` using `JSON.stringify`. The stringify implementation is circular reference safe and uses two spaces as the indentation but you may modify this with the `indent` property.
* `indent`: An integer indicating the number of spaces to indent when converting to a `JSON` string.
* `format`: A custom format string to use to wrap the partial result, should have a single `%s` that will be replaced with the partial content.
