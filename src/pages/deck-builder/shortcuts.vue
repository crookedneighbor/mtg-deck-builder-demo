<template>
  <modal data-cy="shortcut-list" v-if="isOpen" @close="isOpen = false">
    <h2 class="subtitle">Shortcuts</h2>

    <div class="columns">
      <div class="column">
        <ul>
          <li><strong>?</strong> Open this help menu</li>
          <li><strong>a</strong> Add new card</li>
          <li><strong>t</strong> Move between deck views</li>
          <li><strong>/</strong> Focus on the search menu</li>
        </ul>
      </div>
    </div>
  </modal>
</template>

<script>
const Mousetrap = require('mousetrap')
const Modal = require('../../components/modal.vue')

export default {
  components: {
    modal: Modal
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    focusOnAddNewCard () {
      if (this.isOpen) {
        return
      }
      this.$root.$emit('focus-add-new-card')
    },
    focusOnSearch () {
      if (this.isOpen) {
        return
      }
      this.$root.$emit('focus-search')
    },
    toggleDeckView () {
      if (this.isOpen) {
        return
      }

      this.$root.$emit('toggle-deck-view')
    }
  },
  created () {
    Mousetrap.bind('?', () => { this.isOpen = true })
    Mousetrap.bind('a', (e) => {
      e.preventDefault()
      this.focusOnAddNewCard()
    })
    Mousetrap.bind('t', () => { this.toggleDeckView() })
    Mousetrap.bind('/', (e) => {
      e.preventDefault()
      this.focusOnSearch()
    })
  }
}
</script>

<style scoped>
</style>
