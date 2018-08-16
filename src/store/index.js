const Vue = require('vue')
const Vuex = require('vuex')

const MISSING_CARD_IMAGE = require('../lib/constants').MISSING_CARD_IMAGE
const savedDeckManager = require('../lib/state')

const EMPTY_DECK = {
  name: '',
  format: '',
  description: '',
  mainDeck: [],
  sideboard: [],
  commandZone: []
}
const savedDeck = savedDeckManager.load()

const deck = Object.assign({}, EMPTY_DECK, savedDeck)

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    deck: {
      name: deck.name,
      format: deck.format,
      description: deck.description,
      mainDeck: deck.mainDeck,
      sideboard: deck.sideboard,
      commandZone: deck.commandZone
    },
    isFirstTime: Boolean(savedDeck),

    selectedCard: {
      image: MISSING_CARD_IMAGE,
      price: {
        usd: '0'
      }
    },

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
    addCard (state, {card, type}) {
      state.deck[type].push(card)
    },
    removeCard (state, {card, type}) {
      const list = state.deck[type]
      const index = list.findIndex(c => c === card)

      list.splice(index, 1)
    },
    removeList (state, type) {
      const list = state.deck[type]

      while (list.length) {
        list.pop()
      }
    },
    setSelectedCard (state, card) {
      state.selectedCard = card
    }
  },
  actions: {
    saveDeck ({state}) {
      savedDeckManager.save(state.deck)
    },
    deleteDeck ({ commit }) {
      savedDeckManager.remove()

      commit('updateDeck', {
        name: '',
        description: '',
        format: ''
      })

      commit('removeList', 'mainDeck')
      commit('removeList', 'sideboard')
      commit('removeList', 'commandZone')
    }
  },
  getters: {
    hasCommandZone: state => state.deck.format === 'commander' || state.deck.format === 'brawl',
    isSingletonFormat: state => state.deck.format === 'commander' || state.deck.format === 'brawl'
  }
})

module.exports = store
