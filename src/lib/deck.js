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
const VERSION = constants.VERSION

function compileColors (set, list) {
  Object.keys(list).forEach((cardId) => {
    const card = list[cardId]
    card.colorIdentity && card.colorIdentity.forEach((color) => {
      set.add(color)
    })
  })
}

// Since v0.6.0, the format for decklists
// changed from an array to an object.
// For now, we convert the lists to the new
// format, but definitely remove this hack
// by v1.0.0 when a database is persisting
// the data instead of the browser
function updateDeckFromLegacyFormat (deck) {
  if (!Array.isArray(deck.mainDeck)) {
    return
  }

  DECK_LIST_TYPES.forEach((list) => {
    deck[list] = deck[list].reduce((cards, card) => {
      cards[card.id] = card

      return cards
    }, {})
  })
}

class Deck {
  constructor (config) {
    this.__VERSION = config.__VERSION
    this.name = config.name
    this.description = config.description
    this.format = config.format

    this.mainDeck = config.mainDeck
    this.sideboard = config.sideboard
    this.commandZone = config.commandZone

    this.updateColorIdentity()

    updateDeckFromLegacyFormat(this)

    this.cleanUp()
  }

  cleanUp () {
    if (this.__VERSION !== VERSION) {
      this.updateInProgress = true
    }

    this.forEachCardInDeck((card) => {
      card.needsCleanup = Boolean(this.updateInProgress || card.error)
    })

    if (this.updateInProgress) {
      this.refetchCards().then(() => {
        this.forEachCardInDeck((card) => {
          if (!card.error) {
            card.needsCleanup = false
          }
        })
        this.__VERSION = VERSION
        this.updateInProgress = false
        this.saveDeck()
      })
    } else if (this.totalNumberOfCards(card => card.needsCleanup || card.lookupInProgress || card.error) > 0) {
      this.updateInProgress = true

      this.refetchCards(card => card.needsCleanup || card.lookupInProgress || card.error).then(() => {
        this.forEachCardInDeck((card) => {
          if (!card.error) {
            card.needsCleanup = false
          }
        })
        this.updateInProgress = false
        this.saveDeck()
      })
    }
  }

  forEachCardInListType (listType, fn) {
    Object.keys(this[listType]).forEach((cardId) => {
      fn(this[listType][cardId], listType)
    })
  }

  forEachCardInDeck (fn) {
    DECK_LIST_TYPES.forEach((listType) => {
      this.forEachCardInListType(listType, fn)
    })
  }

  updateDeck (updates) {
    Object.keys(updates).forEach((key) => {
      if (key === 'colorIdentity') {
        return
      }
      Vue.set(this, key, updates[key])
    })

    this.updateColorIdentity()
  }

  hasCommandZone () {
    return this.format === 'commander' || this.format === 'brawl'
  }

  isSingletonFormat () {
    return this.format === 'commander' || this.format === 'brawl'
  }

  numberOfCardsInList (listType) {
    return Object.keys(this[listType]).reduce((count, cardId) => {
      let card = this[listType][cardId]

      count += card.quantity

      return count
    }, 0)
  }

  totalNumberOfCards (filter) {
    let total = 0

    this.forEachCardInDeck((card) => {
      if (!filter || filter(card)) {
        total++
      }
    })

    return total
  }

  hasAnyCards (listType) {
    return this.numberOfCardsInList(listType) > 0
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

    this.colorIdentity = ['W', 'U', 'B', 'R', 'G'].filter((color) => {
      return colors.has(color)
    })
  }

  addCard (listType, card) {
    card.needsCleanup = true

    this.setCard(listType, card)
  }

  setCard (listType, card) {
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
      updateInProgress: false
    })
    DECK_LIST_TYPES.forEach(type => this.removeAllCardsFromList(type))
    this.updateColorIdentity()
  }

  lookupCard (listType, card) {
    let promise

    card.lookupInProgress = true
    card.image = card.image || MISSING_CARD_IMAGE
    card.price = card.price || {}
    card.id = card.id || uuid()
    card.error = null

    if (card.scryfallId) {
      promise = findCardByScryfallId(card.scryfallId)
    } else {
      promise = findCardByName(card.name)
    }

    return promise.then(res => formatCard(res, card)).catch((e) => {
      card.error = e.message
      card.needsCleanup = true
    }).then(() => {
      card.lookupInProgress = false
      this[listType][card.id] = Object.assign({}, card)
      this.saveDeck()
    })
  }

  refetchPendingCards () {
    return this.refetchCards(card => card.lookupInProgress)
  }

  refetchCards (filter) {
    let promises = []

    this.forEachCardInDeck((card, type) => {
      if (!filter || filter(card)) {
        promises.push(this.lookupCard(type, card))
      }
    })

    return Promise.all(promises)
  }

  getNumberOfCardsLoaded () {
    let totalNumberOfCardsWhereLookupIsInProgress = this.totalNumberOfCards(card => card.lookupInProgress)

    return this.totalNumberOfCards() - totalNumberOfCardsWhereLookupIsInProgress
  }
}

module.exports = Deck
