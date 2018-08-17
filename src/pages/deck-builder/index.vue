<template>
  <div id="deck-builder" class="columns">
    <div id="deck-list" class="column is-three-fifths">
      <main-details></main-details>

      <deck-list></deck-list>
    </div>

    <card-module></card-module>

    <first-time-modal></first-time-modal>
  </div>
</template>

<script>
const MainDetails = require('./main-details.vue')
const FirstTimeModal = require('./first-time-modal.vue')
const DeckList = require('./deck-list.vue')
const CardModule = require('./card-module.vue')

export default {
  components: {
    'main-details': MainDetails,
    'deck-list': DeckList,
    'card-module': CardModule,
    'first-time-modal': FirstTimeModal,
  },
  data () {
    return {}
  },
  created() {
    this.$store.dispatch('refetchPendingCards')
  }
}
</script>

<style>
#deck-list {
  align-self: center;
}

#deck-builder table td {
  padding-top: 0;
  padding-bottom: 0;
}

#deck-builder .subtitle {
  color: hsl(0, 0%, 21%);
}

.hidden-input {
  border: none;
  box-shadow: none;
}

.hidden-input[disabled] {
  background: none;
}

.hidden-input:focus {
  outline: none;
  outline-style: none;
  border: none;
  box-shadow: none;
}
</style>
