module.exports = function inspect(meta) {
  return function(token, tokens, meta, callback) {
    console.dir(token);
    callback();
  }
}
