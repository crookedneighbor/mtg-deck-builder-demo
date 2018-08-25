<template>
  <div id="card-search" class="column">
    <div id="menu-selection" class="tabs is-centered is-boxed">
      <ul>
        <li
          v-for="option in viewAbleMenuOptions" :key="`menu-option-${option.key}`"
          :class="{'is-active': option.key === menuView}"
          @click="menuView = option.key"
        >
          <a>
            <span>{{option.name}}</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="box">
      <div v-if="menuView === 'commander'">
        <img
          v-for="card in commandZone" :key="`command-zone-${card.id}`"
          :src="card.image"
          :width="(100 / commandZone.length) + '%'"
        />
      </div>

      <search v-if="menuView === 'search'"></search>
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
  data () {
    return {
      menuView: 'search',
      menuOptions: [{
        key: 'commander',
        name: 'Commander',
        shouldShow: () => {
          return this.hasCommandZone
        }
      }, {
        key: 'search',
        name: 'Search',
        shouldShow () {
          return true
        }
      }]
    }
  },
  created () {
    this.$root.$on('focus-search', () => {
      this.menuView = 'search'
    })
  },
  computed: Object.assign(
    mapGetters(['hasCommandZone']),
    {
      commandZone () {
        return this.$store.state.deck.commandZone
      },
      viewAbleMenuOptions () {
        return this.menuOptions.filter((option) => option.shouldShow())
      }
    }
  )
}
</script>

<style scoped>
#card-search {
  position: -webkit-sticky;
  position: sticky;
  top: 5%;
  height: min-content;
}

#menu-selection {
  margin-bottom: 0;
}
</style>
