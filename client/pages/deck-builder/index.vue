<template>
  <div id="deck-builder" class="columns">
    <div id="deck-list" class="column is-three-fifths">
      <main-details></main-details>

      <deck-list></deck-list>
    </div>

    <card-module></card-module>

    <first-time-modal></first-time-modal>
    <shortcuts></shortcuts>
  </div>
</template>

<script>
const MainDetails = require('./main-details/index.vue')
const FirstTimeModal = require('./first-time-modal.vue')
const Shortcuts = require('./shortcuts.vue')
const DeckList = require('./deck-list/index.vue')
const CardModule = require('./card-module/index.vue')

export default {
  components: {
    'main-details': MainDetails,
    'deck-list': DeckList,
    'card-module': CardModule,
    'first-time-modal': FirstTimeModal,
    'shortcuts': Shortcuts
  },
  data () {
    return {}
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
