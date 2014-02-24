module.exports = function inspect(meta) {
  return function(token, tokens, meta, next) {
    console.dir(token);
    next();
  }
}
