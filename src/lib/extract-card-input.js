function extractQuantity (number) {
  if (!number) {
    return 1
  }

  number = number.trim()

  if (number.indexOf('x') > -1) {
    number = number.substring(0, number.length - 1)
  }

  return Number(number.trim())
}

function extractTags (tags) {
  if (!tags) {
    return []
  }

  return tags.split('#').map(tag => tag.toLowerCase().trim()).filter(tag => tag)
}

module.exports = function extractCardInput (input) {
  const pieces = input.match(/^(\d*x? )?([^#]*)(.*)?$/)
  const quantity = extractQuantity(pieces[1])
  const name = pieces[2].trim()
  const tags = extractTags(pieces[3])

  return {
    quantity,
    name,
    tags,
    manaCost: ''
  }
}
