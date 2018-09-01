const Vue = require('vue')
const Vuex = require('vuex')

const uuid = require('uuid/v4')

const Deck = require('../lib/deck')
const constants = require('../lib/constants')
const MISSING_CARD_IMAGE = constants.MISSING_CARD_IMAGE
const DECK_LIST_TYPES = constants.DECK_LIST_TYPES
const VERSION = constants.VERSION

const savedDeckManager = require('../lib/state')
const scryfall = require('../lib/scryfall')
const findCardByName = scryfall.findCardByName
const findCardByScryfallId = scryfall.findCardByScryfallId
const formatCard = scryfall.formatCard

const EMPTY_DECK = {
  name: '',
  format: '',
  description: '',
  colorIdentity: '',
  mainDeck: {},
  sideboard: {},
  commandZone: {}
}
const savedDeck = savedDeckManager.load()

const deck = Object.assign({}, EMPTY_DECK, savedDeck)

// TODO convert old style to new style
// if (Array.isArray(deck.mainDeck)) {
//   DECK_LIST_TYPES.forEach((list) => {
//     deck[list] = deck[list].reduce((cards, card) => {
//       cards[card.id] = card
//
//       return cards
//     }, {})
//   })
// }

if (deck.__VERSION !== VERSION) {
  DECK_LIST_TYPES.forEach((list) => {
    Object.keys(deck[list]).forEach((cardId) => {
      deck[list][cardId].loadInProgress = true
    })
  })

  deck.__VERSION = VERSION
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    deck: new Deck({
      __VERSION: deck.__VERSION,
      name: deck.name,
      format: deck.format,
      description: deck.description,
      colorIdentity: deck.colorIdentity,
      mainDeck: deck.mainDeck,
      sideboard: deck.sideboard,
      commandZone: deck.commandZone
    }),
    isFirstTime: Boolean(savedDeck),

    deckView: 'mainDeck',
    menuView: 'search'
  },

  mutations: {
    updateDeckView (state, value) {
      state.deckView = value
    },
    updateMenuView (state, value) {
      state.menuView = value
    },
    updateDeck (state, deckUpdates) {
      state.deck.updateDeck(deckUpdates)
    },
    addCard (state, {card, type}) {
      state.deck.addCard(type, card)
    },
    removeCard (state, {card, type}) {
      state.deck.removeCard(type, card)
    },
    removeList (state, type) {
      state.deck.removeAllCardsFromList(type)
    }
  },
  actions: {
    saveDeck ({state}) {
      state.deck.saveDeck()
    },
    deleteDeck ({ state, commit }) {
      state.deck.deleteDeck()
      commit('updateDeckView', 'mainDeck')
      commit('updateMenuView', 'search')
    },
    lookupCard ({state}, card) {
      return state.deck.lookupCard(card)
    },
    refetchPendingCards ({state}) {
      state.deck.refetchPendingCards()
    }
  },
  getters: {
    hasCommandZone (state) {
      return state.deck.hasCommandZone()
    },
    isSingletonFormat (state) {
      return state.deck.isSingletonFormat()
    }
  }
})

module.exports = store
