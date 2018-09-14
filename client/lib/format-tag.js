const capitalize = require('./capitalize')

module.exports = function formatTag (tag) {
  let words = tag.split('_')

  return words.map((word) => capitalize(word)).join(' ')
}
