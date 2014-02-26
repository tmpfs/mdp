Middleware functions are executed asynchronously once for each token encountered in the markdown document.

Implementations are passed a `meta` object which is the merged result of processing all the input configuration files (`--input`) and should return a closure that will be invoked once for each token in the document.

The closure function *must* be a named function and should return when zero arguments are passed so that function names may be used within error messages. It is passed the arguments:

* `token`: The current token being processed.
* `tokens`: The list of all tokens in the document, you may use `tokens.peek()` to look ahead but you should not modify the array.
* `next`: A callback to invoke when the token has been processed, signature is: `next(err)`.

If you pass an error to next the program will terminate immediately, failure to invoke `next()` will result in an error after a timeout (`--timeout`) has been exceeded.
