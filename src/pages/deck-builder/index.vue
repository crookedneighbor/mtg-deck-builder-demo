<template>
  <div id="deck-builder" class="columns">
    <div id="deck-list" class="column is-three-fifths">
      <div id="deck-name" class="box">
        <button id="settings-button" class="button is-outlined is-small" @click="shouldShowSettingsModal = true">
          <i class="icon fa fa-sliders-h"></i>
          <span>Settings</span>
        </button>

        <input class="input hidden-input" v-model="deckName" @blur="saveDeck" @keydown.enter="saveDeck" placeholder="Deck Name"/>
        <textarea id="deck-description" class="input hidden-input" v-model="deckDescription" @blur="saveDeck" @keydown.enter="saveDeck" placeholder="Deck notes."/>
      </div>

      <div id="deck-selection" class="tabs is-centered is-boxed">
        <ul>
          <li v-for="(obj, type) in listTypes" :class="{'is-active': type === deckView}" @click="deckView = type" v-if="obj.shouldShow()">
            <a>
              <span>{{obj.name}}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="box">
        <card-list 
          v-if="deckView === 'mainDeck'" 
          :cards="mainDeck" 
          :defaultNumber="getDefaultCardQuantity()"
          v-on:save-deck="onSaveDeck" 
          v-on:hover-over-card="onHoverOverCard"
        ></card-list>

        <card-list 
          v-if="deckView === 'commandZone'" 
          :cards="commandZone" 
          :defaultNumber="getDefaultCardQuantity()"
          v-on:save-deck="onSaveDeck" 
          v-on:hover-over-card="onHoverOverCard"
        ></card-list>

        <card-list 
          :cards="sideboard" 
          :defaultNumber="getDefaultCardQuantity()"
          v-if="deckView === 'sideboard'" 
          v-on:save-deck="onSaveDeck" 
          v-on:hover-over-card="onHoverOverCard"
        ></card-list>
      </div>

      <!-- <div class="box"> -->
      <!--   <h2 class="subtitle"> -->
      <!--     Deck Stats -->
      <!--   </h2> -->
      <!--  -->
      <!--   <strong>Creatures:</strong> {{numberOfCreatures}} -->
      <!--   <hr> -->
      <!--  -->
      <!-- </div> -->
    </div>

    <div id="card-search" class="column">
      <div id="card-preview-selection" class="tabs is-centered is-boxed">
        <ul>
          <li v-for="(obj, type) in secondaryMenuOptions" :class="{'is-active': type === secondaryMenuView}" @click="secondaryMenuView = type" v-if="obj.shouldShow()">
            <a>
              <span>{{obj.name()}}</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="box">
        <div v-if="secondaryMenuView === 'commander'">
          <img :src="card.image" v-for="card in commandZone" :width="(100 / commandZone.length) + '%'"/>
        </div>

        <div v-if="secondaryMenuView === 'previewCard'">
          <img id="card-preview-img" :src="selectedCard.image" />
          <div v-if="selectedCard.price.usd">
            <strong>Price: </strong>${{selectedCard.price.usd}}
          </div>
        </div>

        <div id="search" v-if="secondaryMenuView === 'search'">
          <div class="control" :class="{'is-loading': searchLoading}">
            <input class="input" v-model="search" placeholder="Card Name or Scryfall search" @keydown.enter="searchForCards" :disabled="searchLoading"/>
          </div>

          <p class="content has-text-right is-size-7">
            See <a class="link" href="https://scryfall.com/docs/reference" target="_blank">Scryfall Syntax Guide</a> for help with search syntax.
          </p>

          <div id="search-results">
            <div class="notification is-danger" v-if="searchError">
              <button class="delete" @click="clearSearchError"></button>
              {{searchError}}
            </div>

            <div class="search-result"  v-for="card in searchResults" v-if="!searchLoading">
              <img :src="card.image" />
              <span class="add-card-to-deck icon is-large has-text-white">
              </span>
              <span class="add-card-to-deck icon is-large" @click="addCard(card)">
                <span class="fa-stack fa-lg">
                  <i class="fa fa-circle fa-stack-2x has-text-info"></i>
                  <i class="fas fa-plus fa-stack-1x has-text-white"></i>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal v-if="shouldShowSettingsModal" @close="shouldShowSettingsModal = false">
      <label class="label">Format</label>
      <div class="select">
        <select v-model="format" @change="onFormatChange">
          <option disabled selected value="">Format</option>
          <option value="brawl">Brawl</option>
          <option value="commander">Commander</option>
          <option value="frontier">Frontier</option>
          <option value ="legacy">Legacy</option>
          <option value ="limited">Limited</option>
          <option value ="modern">Modern</option>
          <option value ="pauper">Pauper</option>
          <option value ="standard">Standard</option>
          <option value="vintage">Vintage</option>
        </select>
      </div>

      <hr>
      <div>
        <button class="button is-danger is-large" @click="deleteDeck">Delete</button>
      </div>
    </modal>

    <first-time-modal></first-time-modal>
  </div>
</template>

<script>
const CardList = require('../../components/card-list.vue')
const Modal = require('../../components/modal.vue')
const FirstTimeModal = require('./first-time-modal.vue')
const searchForCards = require('../../lib/scryfall').searchForCards
const formatCard = require('../../lib/scryfall').formatCard
const state = require('../../lib/state')
const autosize = require('autosize')

const MISSING_CARD_IMAGE = require('../../lib/constants').MISSING_CARD_IMAGE
const CARD_LISTS = ['mainDeck', 'sideboard', 'commandZone']


function extractCardInput (input) {
  const pieces = input.match(/^(\d* )?(.*)$/)
  const quantity = pieces[1] ? Number(pieces[1].trim()) : 1
  const name = pieces[2]

  return {
    quantity,
    name,
    manaCost: ''
  }
}

function getTypes (card) {
  if (!card.typeLine) {
    return []
  }

  let mainType = card.typeLine.split(' — ')[0]
  let types = mainType.split(' ')

  return types
}

export default {
  components: {
    'card-list': CardList,
    'modal': Modal,
    'first-time-modal': FirstTimeModal,
  },
  data () {
    let defaultData = {
      newCard: '',
      selectedCard: {
        image: MISSING_CARD_IMAGE,
        price: {
          usd: '0'
        }
      },
      deckName: '',
      format: '',
      deckView: 'mainDeck',
      secondaryMenuView: 'previewCard',
      shouldShowSettingsModal: false,
      searchResults: [],
      secondaryMenuOptions: {
        commander: {
          name(){
            return 'Commander' 
          },
          shouldShow: () => {
            return this.hasCommandZone()
          }
        },
        previewCard: {
          name() {
            return 'Card View' 
          },
          shouldShow() {
            return true
          }
        },
        search: {
          name() {
            return 'Search' 
          },
          shouldShow() {
            return true
          }
        }
      },
      listTypes: { 
        mainDeck: {
          name: 'Main Deck', 
          shouldShow() {
            return true
          }
        },
        commandZone: {
          name: 'Command Zone', 
          shouldShow: () => {
            return this.hasCommandZone()
          }
        },
        sideboard: {
          name: 'Sideboard', 
          shouldShow() {
            return true
          }
        },
        maybe: {
          name: 'Maybe',
          shouldShow() {
            return true
          }
        }
      }
    }

    CARD_LISTS.forEach(list => defaultData[list] = [])

    return defaultData
  },
  methods: {
    searchForCards() {
      this.searchLoading = true
      this.searchError = ''
      this.searchResults.length = 0

      if (!this.search) {
        return
      }

      searchForCards(this.search).then((res) => {
        return Promise.all(res.map(card => formatCard(card)))
      }).then((cards) => {
        this.searchResults.push.apply(this.searchResults, cards)
      }).catch((err) => {
        this.searchError = err.message
      }).then(() => {
        this.searchLoading = false
        this.$forceUpdate()
      })
    },

    clearSearchError() {
      this.searchError = ''
      this.$forceUpdate()
    },
    addCard(card) {
      let cardList = this[this.deckView]
      let lastCard = cardList[cardList.length - 1]

      if (lastCard && lastCard.name === card.name) {
        lastCard.quantity++
      } else {
        cardList.push(JSON.parse(JSON.stringify(card)))
      }

      this.saveDeck()
    },
    onSaveDeck() {
      this.saveDeck()
    },
    onHoverOverCard(card) {
      this.selectedCard = card
    },
    saveDeck() {
      state.save({
        name: this.deckName,
        deckDescription: this.deckDescription,
        format: this.format,
        mainDeck: this.mainDeck,
        sideboard: this.sideboard,
        commandZone: this.commandZone
      })
    },
    loadDeck() {
      let deck = state.load()

      if (!deck) {
        state.remove()
        return
      }

      CARD_LISTS.forEach((list) => {
        deck[list] = deck[list] || []
        deck[list].forEach(card => card.disabled = false)

        this[list].push.apply(this[list], deck[list])
      })

      this.deckName = deck.name
      this.deckDescription = deck.deckDescription
      this.format = deck.format
    },
    deleteDeck() {
      if (!window.confirm('Are you sure you want to delete this deck?')) {
        return
      }

      state.remove()

      this.resetDefaults()

      this.onCloseSettingsModal()
    },
    resetDefaults() {
      this.deckView = 'mainDeck'
      this.secondaryMenuView = 'previewCard'
      this.deckName = ''
      this.deckDescription = ''
      this.format = ''

      CARD_LISTS.forEach((list) => {
        while(this[list].length) {
          this[list].pop()
        }
      })
    },
    hasCommandZone() {
      return this.format === 'commander' || this.format === 'brawl'
    },
    getDefaultCardQuantity() {
      if (this.format === 'commander' || this.format === 'brawl') {
        return 1
      } else {
        return 4
      }
    },
    onFormatChange() {
      if (!this.hasCommandZone()) {
        this.commandZone.length = 0
      }

      this.saveDeck()
    }
  },
  computed: {
    creatures() {
      let creatures = []

      CARD_LISTS.forEach(list => {
        this[list].forEach(card => {
          let types = getTypes(card)

          if (types.indexOf('Creature') > -1) {
            creatures.push(card)
          }
        })
      })

      return creatures
    },
    numberOfCreatures() {
      return this.creatures.reduce((count, card) => {
        count += card.quantity

        return count
      }, 0)
    }
  },
  created() {
    setTimeout(function () {
      autosize(document.querySelector('textarea#deck-description'))
    }, 100)

    if (!window.localStorage.getItem('deck')) {
      this.isFirstTime = true;
    } else {
      this.loadDeck()
    }
  }
}
</script>

<style>
#deck-list {
  align-self: center;
}

#card-preview-img {
  max-width: 300px;
  width: 100%;
}

#deck-builder table td {
  padding-top: 0;
  padding-bottom: 0;
}

#deck-builder .subtitle {
  color: hsl(0, 0%, 21%);
}

#deck-name {
  position: relative;
}

#settings-button {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9;
}

#deck-name input {
  text-align: center;
  font-size: 2em;
}

#deck-selection, #card-preview-selection {
  margin-bottom: 0;
}

.hidden-input {
  border: none;
  box-shadow: none;
}

.hidden-input[disabled] {
  background: none;
}

.hidden-input:focus {
  outline: none;
  outline-style: none;
  border: none;
  box-shadow: none;
}

.search-result {
  display: inline-block;
  width: 48%;
  padding: 1%;
  position: relative;
}

.add-card-to-deck {
  position: absolute;
  bottom: 15px;
  left: 15px;
  z-index: 10;
  cursor: pointer;
  transition: all .2s ease-in-out;
}

.add-card-to-deck:hover {
  transform: scale(1.5)
}

#card-search {
  position: -webkit-sticky;
  position: sticky;
  top: 5%;
  height: min-content;
}

#search #search-results {
  height: 500px;
  overflow: scroll;
}
</style>
