## Meta

Meta data describes processing options and how you want to collate the partials.

### Options

* `generator`: A boolean that disables inclusion of the generator text
* `title`: A string that sets the document title or a partial definition
* `gfm`: A boolean that indicates that [github][github] flavoured markdown is in use
* `period`: The character used by the [pedantic middleware](#pedantic-middleware)
* `include`: A directory that is the base path for [include partials](#include-partial)
* `require`: A directory that is the base path for [require partials](#require-partial)
* `branch`: A branch name to use when resolving links that begin with `/` for [github][github], only applicable if `gfm` is set
* `links`: The name of a links include file, resolved relative to `include`
* `toc`: Enable the table of contents middleware with `true` or set to a string to include a title above the table of contents
* `order`: A boolean that indicates the `toc` middleware should use ordered lists
* `base`: Enable the absolute link middleware, specifies the base URL for absolute links
* `hash`: A boolean that controls whether the absolute middleware operates on URLs that begin with `#`
* `level`: An integer indicating the header level for `title` properties in partial definitions
* `partial`: Array of partial definitions, see [partial](#partial)
