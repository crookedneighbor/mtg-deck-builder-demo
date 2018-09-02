const Vue = require('vue')
const uuid = require('uuid/v4')

const constants = require('./constants')
const savedDeckManager = require('./state')
const scryfall = require('../lib/scryfall')
const findCardByName = scryfall.findCardByName
const findCardByScryfallId = scryfall.findCardByScryfallId
const formatCard = scryfall.formatCard

const MISSING_CARD_IMAGE = constants.MISSING_CARD_IMAGE
const DECK_LIST_TYPES = constants.DECK_LIST_TYPES

function compileColors (set, list) {
  Object.keys(list).forEach((cardId) => {
    const card = list[cardId]
    card.colorIdentity && card.colorIdentity.forEach((color) => {
      set.add(color)
    })
  })
}

class Deck {
  constructor (config) {
    this.__VERSION = config.__VERSION
    this.name = config.name
    this.description = config.description
    this.format = config.format
    this.colorIdentity = config.colorIdentity

    this.mainDeck = config.mainDeck
    this.sideboard = config.sideboard
    this.commandZone = config.commandZone
  }

  updateDeck (updates) {
    Object.keys(updates).forEach((key) => {
      this[key] = updates[key]
    })
  }

  hasCommandZone () {
    return this.format === 'commander' || this.format === 'brawl'
  }

  isSingletonFormat () {
    return this.format === 'commander' || this.format === 'brawl'
  }

  hasAnyCards (deckType) {
    return Object.keys(this[deckType]).length > 0
  }

  updateColorIdentity () {
    let colors = new Set()

    if (this.hasCommandZone() && this.hasAnyCards('commandZone')) {
      compileColors(colors, this.commandZone)
    } else {
      DECK_LIST_TYPES.forEach((list) => {
        compileColors(colors, this[list])
      })
    }

    this.colorIdentity = ['W', 'U', 'B', 'R', 'G'].reduce((str, color) => {
      if (colors.has(color)) {
        str += `{${color}}`
      }

      return str
    }, '')
  }

  addCard (listType, card) {
    Vue.set(this[listType], card.id, card)
  }

  removeCard (listType, card) {
    Vue.delete(this[listType], card.id)
  }

  removeAllCardsFromList (listType) {
    const list = this[listType]

    Object.keys(list).forEach((cardId) => {
      Vue.delete(list, cardId)
    })
  }

  saveDeck () {
    this.updateColorIdentity()
    savedDeckManager.save(this)
  }

  deleteDeck () {
    savedDeckManager.remove()
    this.updateDeck({
      name: '',
      description: '',
      format: '',
      colorIdentity: ''
    })
    DECK_LIST_TYPES.forEach(type => this.removeAllCardsFromList(type))
  }

  lookupCard (card) {
    let promise

    card.loadInProgress = true
    card.image = card.image || MISSING_CARD_IMAGE
    card.price = card.price || {}
    card.id = card.id || uuid()

    if (card.scryfallId) {
      promise = findCardByScryfallId(card.scryfallId)
    } else {
      promise = findCardByName(card.name)
    }

    return promise.then(res => formatCard(res, card)).catch((e) => {
      card.error = e.message
    }).then(() => {
      card.loadInProgress = false
    })
  }

  refetchPendingCards () {
    DECK_LIST_TYPES.forEach((type) => {
      const list = this[type]

      Object.keys(list).forEach((cardId) => {
        const card = list[cardId]

        if (card.loadInProgress) {
          this.lookupCard(card)
        }
      })
    })
  }
}

module.exports = Deck
