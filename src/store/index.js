const Vue = require('vue')
const Vuex = require('vuex')

const Deck = require('../lib/deck')
const constants = require('../lib/constants')
const DECK_LIST_TYPES = constants.DECK_LIST_TYPES
const VERSION = constants.VERSION

const savedDeckManager = require('../lib/state')

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
    menuView: 'search',
    activeDeckTags: {},
    cardInFocus: null,
    cardInPreview: null
  },

  mutations: {
    updateDeckView (state, value) {
      state.deckView = value
    },
    updateMenuView (state, value) {
      state.menuView = value
    },
    setTagActiveState (state, {tag, value}) {
      if (typeof value !== 'boolean') {
        value = !state.activeDeckTags[tag]
      }

      Vue.set(state.activeDeckTags, tag, value)
    },
    setCardInFocus (state, card) {
      Vue.set(state, 'cardInFocus', card)
    },
    setCardInPreview (state, card) {
      Vue.set(state, 'cardInPreview', card)
    }
  },
  actions: {
    deleteDeck ({ state, commit }) {
      state.deck.deleteDeck()
      commit('updateDeckView', 'mainDeck')
      commit('updateMenuView', 'search')
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
