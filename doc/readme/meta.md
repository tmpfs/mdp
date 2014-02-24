## Meta

### Middleware

Middleware may be configured either in the the meta data referencing a known existing middleware function by name or specified on the command line.

Middleware functions are executed asynchronously once for each token encountered in the markdown document.

### Generator

By default `rdm(1)` will append a *generator* message to the end of the document, it is nice if you wish to leave it in to help spread the word, however you may disable this message by setting the `generator` property to `false`.
