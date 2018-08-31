const Vue = require('vue')
const Vuex = require('vuex')

const uuid = require('uuid/v4')

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

function compileColors (set, list) {
  Object.keys(list).forEach((cardId) => {
    const card = list[cardId]
    card.colorIdentity && card.colorIdentity.forEach((color) => {
      set.add(color)
    })
  })
}

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    deck: {
      __VERSION: deck.__VERSION,
      name: deck.name,
      format: deck.format,
      description: deck.description,
      colorIdentity: deck.colorIdentity,
      mainDeck: deck.mainDeck,
      sideboard: deck.sideboard,
      commandZone: deck.commandZone
    },
    isFirstTime: Boolean(savedDeck),

    deckView: 'mainDeck'
  },

  mutations: {
    updateDeckView (state, value) {
      state.deckView = value
    },
    updateDeck (state, deck) {
      Object.keys(deck).forEach((key) => {
        state.deck[key] = deck[key]
      })
    },
    updateColorIdentity (state, hasCommandZone) {
      let colors = new Set()

      if (hasCommandZone && Object.keys(state.deck.commandZone).length > 0) {
        compileColors(colors, state.deck.commandZone)
      } else {
        DECK_LIST_TYPES.forEach((list) => {
          compileColors(colors, state.deck[list])
        })
      }

      state.deck.colorIdentity = ['W', 'U', 'B', 'R', 'G'].reduce((str, color) => {
        if (colors.has(color)) {
          str += `{${color}}`
        }

        return str
      }, '')
    },
    addCard (state, {card, type}) {
      Vue.set(state.deck[type], card.id, card)
    },
    removeCard (state, {card, type}) {
      Vue.delete(state.deck[type], card.id)
    },
    removeList (state, type) {
      const list = state.deck[type]
      Object.keys(list).forEach((cardId) => {
        Vue.delete(list, cardId)
      })
    }
  },
  actions: {
    saveDeck ({commit, state, getters}) {
      commit('updateColorIdentity', getters.hasCommandZone)
      savedDeckManager.save(state.deck)
    },
    deleteDeck ({ commit }) {
      savedDeckManager.remove()

      commit('updateDeck', {
        name: '',
        description: '',
        format: '',
        colorIdentity: ''
      })

      commit('removeList', 'mainDeck')
      commit('removeList', 'sideboard')
      commit('removeList', 'commandZone')
    },
    lookupCard (context, card) {
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
    },
    refetchPendingCards ({state, dispatch}) {
      DECK_LIST_TYPES.forEach((type) => {
        const list = state.deck[type]

        Object.keys(list).forEach((cardId) => {
          const card = list[cardId]

          if (card.loadInProgress) {
            dispatch('lookupCard', card)
          }
        })
      })
    }
  },
  getters: {
    hasCommandZone: state => state.deck.format === 'commander' || state.deck.format === 'brawl',
    isSingletonFormat: state => state.deck.format === 'commander' || state.deck.format === 'brawl'
  }
})

module.exports = store
