<template>
  <table class="table is-fullwidth">
    <tbody>
      <tr v-for="card in cards" @mouseover="hoverOverCard(card)">
        <td class="card-input">
          <input class="input hidden-input" :value="card.quantity + ' ' + card.name" @keyup.enter="blur($event)" @blur="updateCard(card, $event)" :disabled="card.disabled" />
          <div v-if="card.error" class="has-text-danger">{{card.error}}</div>
        </td>
        <td class="secondary-item" @click="focusNearestInput($event)">
          <mana-cost :mana-cost="card.manaCost" v-if="!card.error"></mana-cost>
        </td>
      </tr>
      <tr class="new-card">
        <td>
          <input v-model="newCard" type="text" class="input hidden-input" @keyup.enter="addNew" @blur="addNew" v-bind:placeholder="defaultNumber + ' Card Name'"/>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const findCardByName = require('../lib/scryfall').findCardByName
const formatCard = require('../lib/scryfall').formatCard
const MISSING_CARD_IMAGE = require('../lib/constants').MISSING_CARD_IMAGE

const ManaCost = require('../components/mana-cost.vue')

function extractCardInput (input) {
  const pieces = input.match(/^(\d* )?(.*)$/)
  const quantity = pieces[1] ? Number(pieces[1].trim()) : 1
  const name = pieces[2]

  return {
    quantity,
    name,
    manaCost: ''
  }
}

export default {
  props: ['cards', 'defaultNumber'],
  components: {
    'mana-cost': ManaCost,
  },
  data () {
    return {
      newCard: ''
    }
  },
  methods: {
    blur(event) {
      event.target.blur()
    },
    addNew() {
      const card = extractCardInput(this.newCard)

      if (!card.name) {
        return
      }

      this.cards.push(card)

      this.newCard = ''

      this.lookupCard(card).then(() => this.saveDeck())
    },
    updateCard(card, event) {
      const pieces = extractCardInput(event.target.value)
      event.target.blur()

      if (pieces.name === '') {
        const index = this.cards.findIndex(c => c === card)

        this.cards.splice(index, 1)
        this.saveDeck()
        return
      }

      delete card.error

      card.quantity = pieces.quantity
      card.name = pieces.name

      this.lookupCard(card).then(() => this.saveDeck())
    },
    lookupCard(card) {
      card.disabled = true
      card.image = MISSING_CARD_IMAGE
      card.price = {}

      return findCardByName(card.name).then(res => formatCard(res, card)).catch((e) => {
        card.error = e.message
      }).then(() => {
        card.disabled = false
      })
    },
    saveDeck() {
      this.$emit('save-deck')
      this.$forceUpdate()
    },
    hoverOverCard(card) {
      this.$emit('hover-over-card', card)
    },
    focusNearestInput(event) {
      let input, parentNode = event.target
      let maxFocusRetries = 5
      let retries = 0

      while(!input && retries < maxFocusRetries) {
        parentNode = parentNode.parentNode
        input = parentNode.querySelector('input')
        retries++
      }

      input.focus()
    }
  }
}
</script>

<style scoped>
.new-card {
  border-bottom: 1px solid #dbdbdb;
}

.mana-cost {
  margin-top: 7px;
  min-width: 131px;
}
</style>
