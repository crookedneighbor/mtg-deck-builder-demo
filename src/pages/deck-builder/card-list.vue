<template>
  <table :data-cy="type + '-list'" v-if="deckView === type" class="table is-fullwidth">
    <tbody>
      <tr v-for="card in cards" @mouseover="setSelectedCard(card)">
        <td class="card-input">
          <input class="input hidden-input" :value="card.quantity + ' ' + card.name" @keyup.enter="blur($event)" @blur="updateCard(card, $event)" :disabled="card.loadInProgress" @focus="focusCard(card)" />
          <div v-if="card.error" class="has-text-danger">{{card.error}}</div>
        </td>
        <td class="secondary-item" @click="focusNearestInput($event)">
          <mana-cost :mana-cost="card.manaCost" v-if="!card.error"></mana-cost>
        </td>
      </tr>
      <tr class="new-card">
        <td>
          <input data-cy="new-card-input" v-model="newCard" type="text" class="input hidden-input" @keyup.enter="addNew" @blur="addNew" v-bind:placeholder="defaultNumber + ' Card Name'"/>
        </td>
        <td></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
const MISSING_CARD_IMAGE = require('../../lib/constants').MISSING_CARD_IMAGE

const ManaCost = require('../../components/mana-cost.vue')

const {mapGetters, mapActions, mapState} = require('vuex')

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
  props: ['type'],
  components: {
    'mana-cost': ManaCost,
  },
  data () {
    return {
      newCard: ''
    }
  },
  computed: Object.assign(
    mapGetters(['isSingletonFormat']),
    mapState(['deckView']),
    {
      cards() {
        return this.$store.state.deck[this.type]
      },
      defaultNumber() {
        return this.isSingletonFormat ? '1' : '4'
      },
    }
  ),
  methods: Object.assign(
    mapActions(['lookupCard']),
    {
      blur(event) {
        event.target.blur()
      },
      addNew() {
        const card = extractCardInput(this.newCard)

        if (!card.name) {
          return
        }

        this.$store.commit('addCard', {card, type: this.type})

        this.newCard = ''

        this.lookupCard(card).then(() => this.saveDeck())
      },
      updateCard(card, event) {
        this.cardInFocus = null

        const pieces = extractCardInput(event.target.value)
        event.target.blur()

        if (pieces.name === '') {
          this.$store.commit('removeCard', {card, type: this.type})
          this.saveDeck()
          return
        }

        delete card.error

        card.quantity = pieces.quantity
        card.name = pieces.name

        this.lookupCard(card).then(() => this.saveDeck())
      },
      saveDeck() {
        this.$forceUpdate()
        this.$store.dispatch('saveDeck')
      },
      focusCard(card) {
        this.setSelectedCard(card)
        this.cardInFocus = card
      },
      setSelectedCard(card) {
        if (this.cardInFocus) {
          return
        }
        this.$store.commit('setSelectedCard', card)
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
  )
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
