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
            <span>{{list.name}}</span>
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
        shouldShow () {
          return true
        }
      }, {
        key: 'commandZone',
        name: 'Command Zone',
        shouldShow: () => {
          return this.hasCommandZone
        }
      }, {
        key: 'sideboard',
        name: 'Sideboard',
        shouldShow () {
          return true
        }
      }]
    }
  },
  methods: mapMutations(['updateDeckView']),
  computed: Object.assign(
    mapState([
      'deckView'
    ]),
    mapGetters(['hasCommandZone']),
    {
      listTypeOptions () {
        return this.listTypes.filter((list) => {
          return list.shouldShow()
        })
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
</style>
