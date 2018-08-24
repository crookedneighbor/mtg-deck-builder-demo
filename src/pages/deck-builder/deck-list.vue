<template>
  <div>
    <div id="deck-selection" class="tabs is-centered is-boxed">
      <ul>
        <li v-for="(obj, type) in listTypes" :class="{'is-active': type === deckView}" @click="selectType(type)" v-if="obj.shouldShow()">
          <a>
            <span>{{obj.name}}</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="box">
      <card-list v-for="(obj, type) in listTypes" :type="type"></card-list>
    </div>
  </div>
</template>

<script>
const {mapState, mapGetters} = require('vuex')
const CardList = require('./card-list.vue')
const DECK_LIST_TYPES = require('../../lib/constants').DECK_LIST_TYPES

export default {
  components: {
    'card-list': CardList
  },
  data () {
    return {
      listTypes: {
        mainDeck: {
          name: 'Main Deck',
          shouldShow () {
            return true
          }
        },
        commandZone: {
          name: 'Command Zone',
          shouldShow: () => {
            return this.hasCommandZone
          }
        },
        sideboard: {
          name: 'Sideboard',
          shouldShow () {
            return true
          }
        }
      }
    }
  },
  methods: {
    selectType (type) {
      this.$store.commit('updateDeckView', type)
    },
    incrementDeckView (index) {
    }
  },
  computed: Object.assign(
    mapState([
      'deckView'
    ]),
    mapGetters(['hasCommandZone'])
  ),
  created () {
    this.$root.$on('toggle-deck-view', () => {
      let currentIndex = DECK_LIST_TYPES.indexOf(this.deckView)
      let nextIndex = currentIndex + 1
      let view = this.listTypes[DECK_LIST_TYPES[nextIndex]]

      while (view && !view.shouldShow()) {
        nextIndex++
        view = this.listTypes[DECK_LIST_TYPES[nextIndex]]
      }

      if (!DECK_LIST_TYPES[nextIndex]) {
        nextIndex = 0
      }

      this.$store.commit('updateDeckView', DECK_LIST_TYPES[nextIndex])
    })
  }
}
</script>

<style scoped>
#deck-selection {
  margin-bottom: 0;
}
</style>
