<template>
  <div id="card-search" class="column">
    <div id="secondary-menu-selection" class="tabs is-centered is-boxed">
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

      <search v-if="secondaryMenuView === 'search'"></search>
    </div>
  </div>
</template>

<script>
const {mapGetters} = require('vuex')
const Search = require('./search.vue')

export default {
  components: {
    search: Search
  },
  data() {
    return {
      secondaryMenuView: 'search',
      secondaryMenuOptions: {
        commander: {
          name(){
            return 'Commander'
          },
          shouldShow: () => {
            return this.hasCommandZone
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
  computed: Object.assign(
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
#card-search {
  position: -webkit-sticky;
  position: sticky;
  top: 5%;
  height: min-content;
}

#secondary-menu-selection {
  margin-bottom: 0;
}
</style>
