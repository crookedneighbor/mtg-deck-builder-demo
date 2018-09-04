<template>
  <tr class="new-card">
    <td>
      <input :id="type + '-new-card'" data-cy="new-card-input" v-model="newCard" type="text" class="input hidden-input" @keyup.enter="addNew" @blur="addNew" v-bind:placeholder="defaultNumber + ' Card Name'"/>
    </td>
    <td></td>
  </tr>
</template>

<script>
const extractCardInput = require('../../../lib/extract-card-input')

const {mapGetters, mapState} = require('vuex')

export default {
  props: ['type'],
  data () {
    return {
      newCard: ''
    }
  },
  computed: Object.assign(
    mapGetters(['isSingletonFormat']),
    mapState([
      'deck',
      'deckView'
    ]),
    {
      defaultNumber () {
        return this.isSingletonFormat ? '1' : '4'
      }
    }
  ),
  methods: Object.assign(
    {
      addNew () {
        const card = extractCardInput(this.newCard)

        if (!card.name) {
          return
        }

        this.deck.addCard(this.type, card)

        this.newCard = ''

        this.deck.lookupCard(this.type, card)
      }
    }
  ),
  created () {
    this.$root.$on('focus-add-new-card', () => {
      if (this.type === this.deckView) {
        document.querySelector(`#${this.type}-new-card`).focus()
      }
    })
  }
}
</script>

<style scoped>
.new-card {
  border-bottom: 1px solid #dbdbdb;
}
</style>
