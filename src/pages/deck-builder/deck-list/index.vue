<template>
  <div>
    <div id="deck-selection" class="tabs is-centered is-boxed">
      <ul>
        <li
          v-for="list in listTypeOptions" :key="`card-list-selection-${list.key}`"
          :class="{'is-active': list.key === deckView}"
          :data-cy="`${list.key}-selection`"
          @click="updateDeckView(list.key)"
        >
          <a>
          <span>{{list.name}} <span v-if="list.cards() > 0">({{list.cards()}})</span></span>
          </a>
        </li>
      </ul>
    </div>

    <div class="box">
      <cards
        v-for="list in listTypes" :key="`card-list-${list.key}`"
        :type="list.key"
      ></cards>
    </div>
    <div
      data-cy="deck-update-in-progress-modal"
      class="modal"
      :class="{'is-active': deck.updateInProgress}"
    >
      <div class="modal-background"></div>
      <div class="modal-content">
        <h3 class="title">Deck Update in Progress: {{Math.floor(numberOfCardsLoaded / totalNumberOfCards * 100)}}%</h3>
        <progress class="progress is-large is-info" :value="numberOfCardsLoaded" :max="totalNumberOfCards">{{numberOfCardsLoaded}}%</progress>
      </div>
    </div>
  </div>
</template>

<script>
const {mapState, mapMutations, mapGetters} = require('vuex')
const Cards = require('./cards.vue')

export default {
  components: {
    'cards': Cards
  },
  data () {
    return {
      listTypes: [{
        key: 'mainDeck',
        name: 'Main Deck',
        cards: () => {
          return this.deck.numberOfCardsInList('mainDeck')
        },
        shouldShow () {
          return true
        }
      }, {
        key: 'commandZone',
        name: 'Command Zone',
        cards: () => {
          return this.deck.numberOfCardsInList('commandZone')
        },
        shouldShow: () => {
          return this.hasCommandZone
        }
      }, {
        key: 'sideboard',
        name: 'Sideboard',
        cards: () => {
          return this.deck.numberOfCardsInList('sideboard')
        },
        shouldShow () {
          return true
        }
      }]
    }
  },
  methods: mapMutations(['updateDeckView']),
  computed: Object.assign(
    mapState([
      'deck',
      'deckView'
    ]),
    mapGetters(['hasCommandZone']),
    {
      listTypeOptions () {
        return this.listTypes.filter((list) => {
          return list.shouldShow()
        })
      },
      numberOfCardsLoaded () {
        return this.deck.getNumberOfCardsLoaded()
      },
      totalNumberOfCards () {
        return this.deck.totalNumberOfCards()
      }
    }
  ),
  created () {
    this.$root.$on('toggle-deck-view', () => {
      let currentIndex = this.listTypeOptions.findIndex((list) => {
        return list.key === this.deckView
      })
      let view = this.listTypeOptions[currentIndex + 1]

      if (!view) {
        view = this.listTypeOptions[0]
      }

      this.updateDeckView(view.key)
    })
  }
}
</script>

<style scoped>
#deck-selection {
  margin-bottom: 0;
}

.progress::-webkit-progress-value {
  transition: width 0.5s ease;
}
</style>
