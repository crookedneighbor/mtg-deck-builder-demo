<template>
  <tr
    class="card-row"
    @mouseover="setPreviewCard(card)"
    @mouseout="clearPreviewCard"
    :data-card-id="card.id"
    :data-card-name="card.name"
  >
    <td
      class="card-input"
    >
      <input
        class="input hidden-input"
        :value="cardInputValue(card)"
        @keyup.enter="blur($event)"
        @blur="updateCard(card, $event)"
        :disabled="card.lookupInProgress"
        @focus="focusCard(card, $event)"
      />
      <div v-if="card.error" class="card-lookup-error has-text-danger">{{card.error}}</div>
      <div class="tags" v-if="card.tags.length > 0 && cardInFocus !== card">
        <span
          v-for="tag in card.tags" :key="`${card.id}-tag-${tag}`"
          class="tag"
          :class="{'is-info': activeDeckTags[tag]}"
          @click="setTagActiveState({tag})"
        >{{formatTag(tag)}}</span>
      </div>
    </td>

    <td class="secondary-item" @click="focusNearestInput($event)">
      <mana class="has-text-right" :symbols="card.manaCost" v-if="!card.error"></mana>
    </td>

    <div class="selected-card-preview" v-if="!cardInFocus && cardInPreview === card">
      <div class="preview-container" @click="focusNearestInput($event)">
        <img :src="cardInPreview.image" />
      </div>
    </div>
  </tr>
</template>

<script>
const MISSING_CARD_IMAGE = require('../../../lib/constants').MISSING_CARD_IMAGE
const DEFAULT_PREVIEW_CARD = {
  image: MISSING_CARD_IMAGE,
  price: {
    usd: '0'
  }
}

const extractCardInput = require('../../../lib/extract-card-input')
const formatTag = require('../../../lib/format-tag')

const Mana = require('../../../components/mana.vue')

const {mapMutations, mapState} = require('vuex')

export default {
  props: ['card', 'type'],
  components: {
    mana: Mana
  },
  data () {
    return {}
  },
  computed: Object.assign(
    mapState([
      'activeDeckTags',
      'cardInFocus',
      'cardInPreview',
      'deck'
    ])
  ),
  methods: Object.assign(
    mapMutations([
      'setCardInFocus',
      'setCardInPreview',
      'setTagActiveState'
    ]),
    {
      formatTag (tag) {
        return formatTag(tag)
      },
      blur (event) {
        event.target.blur()
      },
      updateCard (card, event) {
        this.setCardInFocus(null)

        const pieces = extractCardInput(event.target.value)
        event.target.blur()

        if (pieces.name === '') {
          this.deck.removeCard(this.type, card)
          this.deck.saveDeck()
          return
        }

        delete card.error

        card.quantity = pieces.quantity
        card.tags = pieces.tags

        if (pieces.name === card.name && !card.error) {
          // skip look up if card name has not changed
          this.deck.saveDeck()
          return
        }

        if (pieces.name !== card.name) {
          // force fresh look up if card name has changed
          card.needsCleanup = true
          delete card.scryfallId
        }

        card.name = pieces.name

        this.deck.lookupCard(this.type, card)
      },
      focusCard (card, event) {
        let position

        this.setCardInPreview(card)

        this.$nextTick().then(() => {
          position = event.target.selectionStart

          this.setCardInFocus(card)

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
      clearPreviewCard () {
        this.setCardInPreview(DEFAULT_PREVIEW_CARD)
      },
      setPreviewCard (card) {
        if (this.cardInFocus) {
          return
        }
        this.setCardInPreview(card)
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
  )
}
</script>

<style scoped>
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
