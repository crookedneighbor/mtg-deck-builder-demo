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

export default {
  components: {
    'card-list': CardList,
  },
  data() {
    return {
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
            return this.hasCommandZone
          }
        },
        sideboard: {
          name: 'Sideboard', 
          shouldShow() {
            return true
          }
        },
        // maybe: {
        //   name: 'Maybe',
        //   shouldShow() {
        //     return true
        //   }
        // }
      }
    }
  },
  methods: {
    selectType(type) {
      this.$store.commit('updateDeckView', type)
    }
  },
  computed: Object.assign(
    mapState([
      'deckView'
    ]),
    mapGetters(['hasCommandZone'])
  ),
}
</script>

<style scoped>
#deck-selection {
  margin-bottom: 0;
}
</style>
