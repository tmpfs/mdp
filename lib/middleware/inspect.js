module.exports = function inspect(meta) {
  if(!arguments.length) return;
  return function(token, tokens, meta, next) {
    console.dir(token);
    next();
  }
}
