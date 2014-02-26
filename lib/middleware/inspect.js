module.exports = function middleware(meta) {
  return function inspect(token, tokens, meta, next) {
    if(!arguments.length) return;
    console.dir(token);
    next();
  }
}
