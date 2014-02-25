## Meta

Meta data describes processing options and how you want to collate the partials.

### Options

* `generator`: A boolean that disables inclusion of the generator text.
* `title`: A string that sets the document title, will become a `h1`.
* `gfm`: A boolean that indicates that [github][github] flavoured markdown is in use.
* `period`: The character used by the [pedantic middleware](#pedantic-middleware).
* `include`: A directory that is the base path for [include partials](#include-partial).
* `require`: A directory that is the base path for [require partials](#require-partial).

### Partial 

A partial may be one of:

* `literal`: A string literal.
* `reference`: A property reference.
* `include`: Include a file, normally a markdown document but not necessarily.
* `binary`: Execute a command and use `stdout` as the content.
* `require`: Require a `.js` module or a `.json` file.

All keys are available using a three character abbreviation, specifiying `bin` is equivalent to `binary`.

### Generator

By default `rdm(1)` will append a *generator* message to the end of the document, it is nice if you wish to leave it in to help spread the word, however you may disable this message by setting the `generator` property to `false`.
