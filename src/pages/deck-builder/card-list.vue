<template>
  <div :data-cy="type + '-list'" v-if="deckView === type">
    <table class="table is-fullwidth">
      <tbody>
        <tr
          v-for="card in cards" :key="`card-${card.id}`"
          v-show="shouldShow(card)"
          class="card-row"
          @mouseover="setSelectedCard(card)"
          @mouseout="clearSelectedCard"
        >
          <td class="card-input">
            <input class="input hidden-input" :value="cardInputValue(card)" @keyup.enter="blur($event)" @blur="updateCard(card, $event)" :disabled="card.loadInProgress" @focus="focusCard(card, $event)" />
            <div v-if="card.error" class="card-lookup-error has-text-danger">{{card.error}}</div>
            <div class="tags" v-if="card.tags.length > 0 && cardInFocus !== card">
              <span
                v-for="tag in card.tags" :key="`${card.id}-tag-${tag}`"
                class="tag"
                :class="{'is-info': activeDeckTags[tag]}"
                @click="toggleTagActivity(tag)"
              >{{formatTag(tag)}}</span>
            </div>
          </td>
          <td class="secondary-item" @click="focusNearestInput($event)">
            <mana class="has-text-right" :symbols="card.manaCost" v-if="!card.error"></mana>
          </td>

          <div class="selected-card-preview" v-if="!cardInFocus && selectedCard === card">
            <div class="preview-container" @click="focusNearestInput($event)">
              <img :src="selectedCard.image" />
            </div>
          </div>
        </tr>
        <tr class="new-card">
          <td>
            <input :id="type + '-new-card'" data-cy="new-card-input" v-model="newCard" type="text" class="input hidden-input" @keyup.enter="addNew" @blur="addNew" v-bind:placeholder="defaultNumber + ' Card Name'"/>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <div v-if="cardListTags.length > 0">
      <h3 class="subtitle">Filter Cards by Tags</h3>

      <div class="tags">
        <span
          v-for="tag in cardListTags" :key="`tag-name-${tag}`"
          class="tag"
          :class="{'is-info': activeDeckTags[tag]}"
          @click="toggleTagActivity(tag)"
        >{{formatTag(tag)}}</span>
        <span class="tag is-warning" v-if="anyTagActive()" @click="clearActiveTags">Clear Tags</span>
      </div>
    </div>

  </div>
</template>

<script>
const uuid = require('uuid/v4')
const MISSING_CARD_IMAGE = require('../../lib/constants').MISSING_CARD_IMAGE
const DEFAULT_SELECTED_CARD = {
  image: MISSING_CARD_IMAGE,
  price: {
    usd: '0'
  }
}

const extractCardInput = require('../../lib/extract-card-input')

const Mana = require('../../components/mana.vue')

const {mapGetters, mapActions, mapState} = require('vuex')

export default {
  props: ['type'],
  components: {
    'mana': Mana
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
      cards () {
        const list = this.$store.state.deck[this.type]

        return Object.keys(list).reduce((cards, cardId) => {
          cards.push(list[cardId])
          return cards
        }, [])
      },
      defaultNumber () {
        return this.isSingletonFormat ? '1' : '4'
      },
      cardListTags () {
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
      anyTagActive () {
        for (let tag in this.activeDeckTags) {
          if (this.cardListTags.indexOf(tag) === -1) {
            delete this.activeDeckTags[tag]
          } else if (this.activeDeckTags[tag]) {
            return true
          }
        }

        return false
      },
      clearActiveTags () {
        for (let tag in this.activeDeckTags) {
          this.activeDeckTags[tag] = false
        }
      },
      shouldShow (card) {
        if (!this.anyTagActive()) {
          return true
        }

        return Boolean(card.tags.find(tag => this.activeDeckTags[tag]))
      },
      toggleTagActivity (tag) {
        this.$set(this.activeDeckTags, tag, !this.activeDeckTags[tag])
      },
      formatTag (tag) {
        let words = tag.split('_')

        return words.map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      },
      blur (event) {
        event.target.blur()
      },
      addNew () {
        const card = extractCardInput(this.newCard)

        if (!card.name) {
          return
        }

        card.id = uuid()

        this.$store.commit('addCard', {card, type: this.type})

        this.newCard = ''

        this.lookupCard(card).then(() => this.saveDeck())
      },
      updateCard (card, event) {
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
        card.tags = pieces.tags

        if (pieces.name === card.name && !card.error) {
          // skip look up if card name has not changed
          this.saveDeck()
          return
        }

        if (pieces.name !== card.name) {
          // force fresh look up if card name has changed
          delete card.scryfallId
        }

        card.name = pieces.name

        this.lookupCard(card).then(() => this.saveDeck())
      },
      saveDeck () {
        this.$forceUpdate()
        this.$store.dispatch('saveDeck')
      },
      focusCard (card, event) {
        let position

        this.setSelectedCard(card)

        this.$nextTick().then(() => {
          position = event.target.selectionStart

          this.cardInFocus = card

          this.$forceUpdate()

          return this.$nextTick()
        }).then(() => {
          event.target.setSelectionRange(position, position)
        })
      },
      cardInputValue (card) {
        let value = `${card.quantity} ${card.name}`

        if (this.cardInFocus === card) {
          value += ` ${card.tags.map(tag => `#${tag}`).join(' ')}`
        }

        return value
      },
      clearSelectedCard () {
        this.selectedCard = DEFAULT_SELECTED_CARD
      },
      setSelectedCard (card) {
        if (this.cardInFocus) {
          return
        }
        this.selectedCard = card
      },
      focusNearestInput (event) {
        let input
        let parentNode = event.target
        let maxFocusRetries = 5
        let retries = 0

        while (!input && retries < maxFocusRetries) {
          parentNode = parentNode.parentNode
          input = parentNode.querySelector('input')
          retries++
        }

        input.focus()
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

.secondary-item .mana-symbols {
  margin-top: 9px;
}
</style>
