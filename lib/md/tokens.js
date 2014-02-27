function header(text, depth) {
  return {type: 'heading', text: text, depth: 1};
}

module.exports = {
  header: header
}
