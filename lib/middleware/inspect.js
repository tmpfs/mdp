module.exports = function middleware(/*meta*/) {
  return function inspect(token, tokens, next) {
    if(!arguments.length) {
      return;
    }
    console.dir(token);
    next();
  }
}
