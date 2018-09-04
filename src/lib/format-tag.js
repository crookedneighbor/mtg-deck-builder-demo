module.exports = function formatTag (tag) {
  let words = tag.split('_')

  return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
}
