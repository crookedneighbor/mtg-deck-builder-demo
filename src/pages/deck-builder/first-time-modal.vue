<template>
  <modal data-cy="first-time-modal" v-if="isFirstTime" @close="isFirstTime = false">
    <h2 class="subtitle">First time here?</h2>

    <div class="content">
      <p>Hello! Welcome to this deck builder demo. Some things to note:</p>

      <ul class="has-text-left">
        <li>Your deck will be saved automatically when you make a change, but it is only saved locally to your browser's local storage. There is no database persisting your deck. So if you clear your browser's data, you'll lose your deck.</li>
        <li>Currently, only one deck can be saved a time.</li>
        <li>As changes are made to the app, your previously saved deck may become incompatible and be lost. Do not rely on this deck builder until it goes out of Beta.</li>
        <li>This is very much a work in progress project, so don't be surprised if there are bugs. If you find one, <a class="link" href="https://github.com/crookedneighbor/mtg-deck-builder-demo/issues">kindly report it on Github</a>.</li>
      </ul>
    </div>
  </modal>
</template>

<script>
const Modal = require('../../components/modal.vue')

export default {
  components: {
    modal: Modal
  },
  data() {
    const hasStoredDeck = window.localStorage.getItem('deck')

    return {
      isFirstTime: !hasStoredDeck
    }
  },
}
</script>

<style scoped>
</style>


