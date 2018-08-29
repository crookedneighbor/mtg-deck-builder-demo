const uuid = require('uuid/v4')
const ScryfallClient = require('scryfall-client')
const scryfall = new ScryfallClient()

function findCardByName (name) {
  return scryfall.get('/cards/named', {
    fuzzy: name
  })
}

function findCardByScryfallId (id) {
  return scryfall.get(`/cards/${id}`)
}

function searchForCards (query) {
  return scryfall.get('/cards/search', {
    q: query
  })
}

function formatCard (response, card = {}) {
  card.quantity = card.quantity || 1
  card.id = card.id || uuid()
  card.name = response.name
  card.typeLine = response.type_line
  card.scryfallId = response.id
  card.manaCost = response.mana_cost || (response.card_faces && response.card_faces[0].mana_cost) || ''
  card.colorIdentity = response.color_identity
  card.price = {
    usd: response.usd,
    eur: response.eur,
    tix: response.tix
  }
  card.tags = card.tags || []

  return response.getImage().then((img) => {
    card.image = img

    return card
  })
}

module.exports = {
  findCardByName,
  findCardByScryfallId,
  searchForCards,
  formatCard
}
