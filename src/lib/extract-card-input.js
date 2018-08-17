module.exports = function extractCardInput (input) {
  input = input.replace(/[^\u0000-\u007E]/g, '').trim()
  const pieces = input.match(/^(\d* )?(.*)$/)
  const quantity = pieces[1] ? Number(pieces[1].trim()) : 1
  const name = pieces[2]

  return {
    quantity,
    name,
    manaCost: ''
  }
}
