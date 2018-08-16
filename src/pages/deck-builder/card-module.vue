<template>
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
</template>

<script>
const {mapState, mapGetters} = require('vuex')
const searchForCards = require('../../lib/scryfall').searchForCards
const formatCard = require('../../lib/scryfall').formatCard

export default {
  data() {
    return {
      search: '',
      searchLoading: false,
      searchError: '',
      searchResults: [],
      secondaryMenuView: 'previewCard',
      secondaryMenuOptions: {
        commander: {
          name(){
            return 'Commander' 
          },
          shouldShow: () => {
            return this.hasCommandZone
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
    }
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
      })
    },

    clearSearchError() {
      this.searchError = ''
      this.$forceUpdate()
    },
    addCard(card) {
      const list = this.$store.state.deck[this.deckView]
      const lastCard = list[list.length - 1]

      if (lastCard.name === card.name) {
        lastCard.quantity++
      } else {
        this.$store.commit('addCard', {card, type: this.deckView})
      }
      this.$store.dispatch('saveDeck')
    }
  },
  computed: Object.assign(
    mapState([
      'selectedCard',
      'deckView',
    ]),
    mapGetters(['hasCommandZone']),
    {
      commandZone() {
        return this.$store.state.deck.commandZone
      },
    }
  ),
}
</script>

<style scoped>
#card-preview-img {
  max-width: 300px;
  width: 100%;
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

#card-preview-selection {
  margin-bottom: 0;
}
</style>
