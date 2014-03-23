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

#### Binary

Execute a command and include the command's `stdout` in the resulting document. If the command prints markdown then you can use that output, otherwise you can wrap the command's output as a markdown element of just include is literally. This is particularly useful when you want to include a program's help (`--help`) output as a section within a document.

#### Require

Require a `js` module or a `json` file. Files are resolved relative to the `require` configuration directory, if the `require` configuration property is not set they are resolved relative to the current working directory.
