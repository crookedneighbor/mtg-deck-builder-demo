<template>
  <div :data-cy="type + '-list'" v-if="deckView === type">
    <table class="table is-fullwidth">
      <tbody>
        <tr class="card-row" v-for="card in cards" @mouseover="setSelectedCard(card)" @mouseout="clearSelectedCard" v-if="shouldShow(card)">
          <td class="card-input">
            <input class="input hidden-input" :value="cardInputValue(card)" @keyup.enter="blur($event)" @blur="updateCard(card, $event)" :disabled="card.loadInProgress" @focus="focusCard(card, $event)" />
            <div v-if="card.error" class="has-text-danger">{{card.error}}</div>
            <div class="tags" v-if="card.tags.length > 0 && cardInFocus !== card">
              <span class="tag" :class="{'is-info': activeDeckTags[tag]}" v-for="tag in card.tags" @click="toggleTagActivity(tag)">{{formatTag(tag)}}</span>
            </div>
          </td>
          <td class="secondary-item" @click="focusNearestInput($event)">
            <mana-cost :mana-cost="card.manaCost" v-if="!card.error"></mana-cost>
          </td>

          <div class="selected-card-preview" v-if="!cardInFocus && selectedCard === card">
            <div class="preview-container">
              <img :src="selectedCard.image" />
            </div>
          </div>
        </tr>
        <tr class="new-card">
          <td>
            <input data-cy="new-card-input" v-model="newCard" type="text" class="input hidden-input" @keyup.enter="addNew" @blur="addNew" v-bind:placeholder="defaultNumber + ' Card Name'"/>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <div v-if="cardListTags.length > 0">
      <h3 class="subtitle">Filter Cards by Tags</h3>

      <div class="tags">
        <span class="tag" :class="{'is-info': activeDeckTags[tag]}" v-for="tag in cardListTags" @click="toggleTagActivity(tag)">{{formatTag(tag)}}</span>
        <span class="tag is-warning" v-if="anyTagActive()" @click="clearActiveTags">Clear Tags</span>
      </div>
    </div>

  </div>
</template>

<script>
const MISSING_CARD_IMAGE = require('../../lib/constants').MISSING_CARD_IMAGE
const DEFAULT_SELECTED_CARD = {
  image: MISSING_CARD_IMAGE,
  price: {
    usd: '0'
  }
}

const extractCardInput = require('../../lib/extract-card-input')

const ManaCost = require('../../components/mana-cost.vue')

const {mapGetters, mapActions, mapState} = require('vuex')

export default {
  props: ['type'],
  components: {
    'mana-cost': ManaCost,
  },
  data () {
    return {
      newCard: '',
      activeDeckTags: {},
      selectedCard: DEFAULT_SELECTED_CARD
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
      cardListTags() {
        let tags = new Set()

        this.cards.forEach((card) => {
          card.tags.forEach(tag => tags.add(tag))
        })

        return Array.from(tags)
      }
    }
  ),
  methods: Object.assign(
    mapActions(['lookupCard']),
    {
      anyTagActive() {
        for (let tag in this.activeDeckTags) {
          if (this.cardListTags.indexOf(tag) === -1) {
            delete this.activeDeckTags[tag]
          } else if (this.activeDeckTags[tag]) {
            return true
          }
        }

        return false
      },
      clearActiveTags() {
        for (let tag in this.activeDeckTags) {
          this.activeDeckTags[tag] = false
        }

        this.$forceUpdate()
      },
      shouldShow(card) {
        if (!this.anyTagActive()) {
          return true
        }

        return Boolean(card.tags.find(tag => this.activeDeckTags[tag]))
      },
      toggleTagActivity(tag) {
        this.activeDeckTags[tag] = !this.activeDeckTags[tag]
        this.$forceUpdate()
      },
      formatTag(tag) {
        let words = tag.split('_')

        return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      },
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
        card.tags = pieces.tags

        this.lookupCard(card).then(() => this.saveDeck())
      },
      saveDeck() {
        this.$forceUpdate()
        this.$store.dispatch('saveDeck')
      },
      focusCard(card, event) {
        this.setSelectedCard(card)

        setTimeout(() => {
          let position = event.target.selectionStart

          this.cardInFocus = card

          this.$forceUpdate()

          setTimeout(() => {
            event.target.setSelectionRange(position, position)
          }, 1)
        }, 1)
      },
      cardInputValue(card) {
        let value = `${card.quantity} ${card.name}`

        if (this.cardInFocus === card) {
          value += ` ${card.tags.map(tag => `#${tag}`).join(' ')}`
        }

        return value
      },
      clearSelectedCard() {
        this.selectedCard = DEFAULT_SELECTED_CARD
      },
      setSelectedCard(card) {
        if (this.cardInFocus) {
          return
        }
        this.selectedCard = card
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

.tag {
  cursor: pointer;
}

.selected-card-preview {
  position: relative;
}

.selected-card-preview img {
  max-width: 100%;
  border-radius: 15px;
}

.selected-card-preview .preview-container {
  position: absolute;
  right: -50px;
  top: -150px;
  width: 300px;
  z-index: 99;
}
</style>
