<template>
  <div id="card-search" class="column">
    <div id="menu-selection" class="tabs is-centered is-boxed">
      <ul>
        <li
          v-for="option in viewAbleMenuOptions" :key="`menu-option-${option.key}`"
          :data-cy="`${option.key}-secondary-menu-selection`"
          :class="{'is-active': option.key === menuView}"
          @click="updateMenuView(option.key)"
        >
          <a>
            <span>{{option.name}}</span>
          </a>
        </li>
      </ul>
    </div>

    <div class="box">
      <div data-cy="commander-view" v-if="menuView === 'commander'">
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
const {mapState, mapGetters} = require('vuex')
const Search = require('./search.vue')

export default {
  components: {
    search: Search
  },
  data () {
    return {
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
      this.updateMenuView('search')
    })
  },
  methods: {
    updateMenuView (value) {
      this.$store.commit('updateMenuView', value)
    }
  },
  computed: Object.assign(
    mapGetters(['hasCommandZone']),
    mapState(['menuView', 'deck']),
    {
      commandZone () {
        return this.deck.commandZone
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
