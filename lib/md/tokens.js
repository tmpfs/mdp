function header(text, depth) {
  return {type: 'heading', text: text, depth: 1};
}

function paragraph(text) {
  return {type: 'paragraph', text: text};
}

module.exports = {
  header: header,
  paragraph: paragraph
}
