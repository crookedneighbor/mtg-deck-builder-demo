function save (deck) {
  window.localStorage.setItem('deck', JSON.stringify(deck))
}

function load () {
  let deck
  let stringifiedDeck = window.localStorage.getItem('deck')

  if (!stringifiedDeck) {
    return
  }

  try {
    deck = JSON.parse(stringifiedDeck)
  } catch (e) {
    return
  }

  return deck
}

function remove () {
  window.localStorage.removeItem('deck')
}

module.exports = {
  save,
  load,
  remove,
}
