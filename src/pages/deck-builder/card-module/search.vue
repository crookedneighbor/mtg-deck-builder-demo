<template>
  <div id="search">
    <div class="control" :class="{'is-loading': searchLoading}">
      <input data-cy="search-input" id="search-input" class="input" v-model="search" placeholder="Card Name or Scryfall search" @keydown.enter="searchForCards" :disabled="searchLoading"/>
    </div>

    <p class="has-text-right is-size-7">
      See <a class="link" href="https://scryfall.com/docs/reference" target="_blank">Scryfall Syntax Guide</a> for help with search syntax.
    </p>

    <div data-cy="search-results" id="search-results" @scroll="onSearchScroll">
      <div data-cy="search-error" class="notification is-danger" v-if="searchError">
        <button class="delete" @click="clearSearchError"></button>
        {{searchError}}
      </div>

      <div
        v-for="card in searchResults" :key="`search-result-${card.id}`"
        class="search-result"
      >
        <img :src="card.image" />
        <span class="add-card-to-deck icon is-large" @click="addCard(card)">
          <span class="fa-stack fa-lg">
            <i class="fa fa-circle fa-stack-2x has-text-info"></i>
            <i class="fas fa-plus fa-stack-1x has-text-white"></i>
          </span>
        </span>
      </div>

      <div v-if="searchLoading">
        <span class="icon is-large">
          <i class="fas fa-3x fa-circle-notch fa-spin"></i>
        </span>
      </div>
    </div>

    <p id="search-result-numbers" class="has-text-right is-size-7" v-if="totalSearchResults > 0">{{searchResults.length}} / {{totalSearchResults}} results</p>

  </div>
</template>

<script>
const uuid = require('uuid/v4')
const {mapState} = require('vuex')
const addActiveTags = require('../../../lib/add-active-tags')
const searchForCards = require('../../../lib/scryfall').searchForCards
const formatCard = require('../../../lib/scryfall').formatCard

export default {
  data () {
    return {
      rawResponseFromScryfall: null,
      search: '',
      searchLoading: false,
      searchError: '',
      searchResults: [],
      totalSearchResults: 0
    }
  },
  methods: {
    searchForCards () {
      let search = this.search

      this.clearSearchError()
      this.searchResults = []
      this.totalSearchResults = 0
      this.rawResponseFromScryfall = null

      if (!search) {
        return
      }

      this.searchLoading = true

      if (this.shouldRestrictToColorIdentity) {
        search += ` ids:${this.deck.colorIdentity.join('')}`
      }

      if (this.shouldRestrictByFormat) {
        search += ` format:${this.deck.format}`
      }

      searchForCards(search).then((res) => {
        return this.addToSearchResults(res)
      }).catch((err) => {
        this.searchError = err.message
        this.searchLoading = false
      })
    },
    clearSearchError () {
      this.searchError = ''
    },
    addCard (card) {
      card = Object.assign({}, card, {id: uuid()})

      addActiveTags(card, this.activeDeckTags)

      const cardInCleanupSection = document.querySelector(`#${this.deckView}-clean-up .card-row[data-card-name="${card.name}"]`)

      if (cardInCleanupSection) {
        const list = this.deck[this.deckView]
        list[cardInCleanupSection.getAttribute('data-card-id')].quantity++
      } else {
        this.deck.addCard(this.deckView, card)
      }
      this.deck.saveDeck()
    },
    onSearchScroll (event) {
      if (this.shouldLookForMoreResults(event)) {
        this.searchLoading = true

        this.rawResponseFromScryfall.next().then((res) => {
          return this.addToSearchResults(res)
        })
      }
    },
    addToSearchResults (res) {
      this.rawResponseFromScryfall = res
      this.totalSearchResults = res.total_cards

      return Promise.all(res.map(card => formatCard(card))).then((cards) => {
        this.searchResults.push.apply(this.searchResults, cards)
      }).catch((err) => {
        this.searchError = err.message
      }).then(() => {
        this.searchLoading = false
      })
    },
    shouldLookForMoreResults (event) {
      let target = event.target
      let isAtEndOfCurrentResults = target.offsetHeight + target.scrollTop > target.scrollHeight - 2000
      let hasMoreResults = this.rawResponseFromScryfall && this.rawResponseFromScryfall.has_more

      return !this.searchLoading && hasMoreResults && isAtEndOfCurrentResults
    },
    searchHasTerm (term) {
      return this.search.match(new RegExp(term))
    }
  },
  created () {
    this.$root.$on('focus-search', () => {
      // need to wait for the next tick in case the search
      // view is not yet selected
      this.$nextTick().then(() => {
        document.querySelector('#search-input').focus()
      })
    })
  },
  computed: Object.assign(
    mapState([
      'activeDeckTags',
      'deckView',
      'deck'
    ]),
    {
      shouldRestrictToColorIdentity () {
        let deckHasRestrictiveColorIdentity = this.deck.hasCommandZone() && this.deck.colorIdentity.length > 0

        if (!deckHasRestrictiveColorIdentity) {
          return false
        }

        return !this.searchHasTerm('id(s|entity)?(=|:|>=|<=|!=|>|<)')
      },
      shouldRestrictByFormat () {
        let deckHasRestrictiveFormat = this.deck.format && this.deck.format !== 'limited'

        if (!deckHasRestrictiveFormat) {
          return false
        }

        return !this.searchHasTerm('f(ormat)?(:|=)')
      }
    }
  )
}
</script>

<style scoped>
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

#search #search-results {
  height: 500px;
  overflow: scroll;
}

#search-result-numbers {
  margin-bottom: -15px;
}
</style>
