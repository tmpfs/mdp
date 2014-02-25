## Meta

Meta data describes processing options and how you want to collate the partials.

### Options

* `generator`: A boolean that disables inclusion of the generator text.
* `title`: A string that sets the document title.
* `gfm`: A boolean that indicates that [github][github] flavoured markdown is in use.
* `period`: The character used by the [pedantic middleware](#pedantic-middleware).
* `include`: A directory that is the base path for [include partials](#include-partial).
* `require`: A directory that is the base path for [require partials](#require-partial).
* `branch`: A branch name to use when resolving links that begin with `/` for [github][github], only applicable if `gfm` is set.
* `links`: The name of a links include file, resolved relative to `include`.
* `toc`: Enable the table of contents middleware with `true` or set to a string to include a title above the table of contents.
* `order`: A boolean that indicates the `toc` middleware should use ordered lists.
* `base`: Enable the absolute link middleware, specifies the base URL for absolute links.
* `hash`: A boolean that controls whether the absolute middleware operates on URLs that begin with `#`.
* `partial`: Array of partial definitions, see [partial](#partial).

### Partial 

A partial may be one of:

* `literal`: A string literal.
* `reference`: A property reference.
* `include`: Include a file, normally a markdown document but not necessarily.
* `binary`: Execute a command and use `stdout` as the content.
* `require`: Require a `.js` module or a `.json` file.

All keys are available using a three character abbreviation, specifiying `bin` is equivalent to `binary`.

### Generator

By default `mdp(1)` will append a *generator* message to the end of the document, it is nice if you wish to leave it in to help spread the word, however you may disable this message by setting the `generator` property to `false`.
