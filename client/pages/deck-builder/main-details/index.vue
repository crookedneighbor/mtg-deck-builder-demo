<template>
  <div id="deck-name" class="box">
    <button data-cy="settings-button" id="settings-button" class="button is-outlined is-small" @click="shouldShowSettingsModal = true">
      <i class="icon fa fa-sliders-h"></i>
      <span>Settings</span>
    </button>

    <input data-cy="deck-name-input" class="input hidden-input" v-model="name" @blur="saveDeck" @keydown.enter="saveDeck" placeholder="Deck Name"/>

    <mana :symbols="colorIdentity"></mana>

    <div class="select">
      <select data-cy="format-select" v-model="format" @change="onFormatChange">
        <option disabled selected value="">Format</option>
        <option value="brawl">Brawl</option>
        <option value="commander">Commander</option>
        <option value="frontier">Frontier</option>
        <option value="legacy">Legacy</option>
        <option value="limited">Limited</option>
        <option value="modern">Modern</option>
        <option value="pauper">Pauper</option>
        <option value="standard">Standard</option>
        <option value="vintage">Vintage</option>
      </select>
    </div>

    <textarea data-cy="deck-description-input" id="deck-description" class="input hidden-input" v-model="description" @blur="saveDeck" @keydown.enter="saveDeck" placeholder="Deck notes."/>

    <modal v-if="shouldShowSettingsModal" @close="closeSettingsModal">
      <import-export-buttons
        v-on:close-modal="closeSettingsModal"
      ></import-export-buttons>

      <hr>

      <div>
        <button data-cy="delete-button" class="button is-danger is-large" @click="promptToDeleteDeck">Delete</button>
      </div>
    </modal>
  </div>
</template>

<script>
const autosize = require('autosize')
const {mapActions, mapMutations, mapGetters, mapState} = require('vuex')
const constructComputedMethodsForDeck = require('../../../lib/construct-computed-methods-for-deck')

const Modal = require('../../../components/modal.vue')
const Mana = require('../../../components/mana.vue')
const ImportExportButtons = require('./import-export-buttons.vue')

export default {
  components: {
    modal: Modal,
    mana: Mana,
    'import-export-buttons': ImportExportButtons
  },
  data () {
    return {
      shouldShowSettingsModal: false
    }
  },
  computed: Object.assign(
    constructComputedMethodsForDeck([
      'name',
      'description',
      'format'
    ]),
    mapGetters(['hasCommandZone']),
    mapState(['deck', 'deckView']),
    {
      colorIdentity () {
        if (!this.deck.colorIdentity) {
          return ''
        }
        return this.deck.colorIdentity.reduce((str, color) => {
          str += `{${color}}`

          return str
        }, '')
      }
    }
  ),
  methods: Object.assign(
    mapActions(['deleteDeck']),
    mapMutations(['updateDeckView']),
    {
      closeSettingsModal () {
        this.shouldShowSettingsModal = false
      },
      promptToDeleteDeck () {
        if (!window.confirm('Are you sure you want to delete this deck?')) {
          return
        }

        this.deleteDeck()

        this.shouldShowSettingsModal = false
      },
      onFormatChange (event) {
        this.deck.updateDeck({
          format: event.target.value
        })

        if (!this.hasCommandZone) {
          this.deck.removeAllCardsFromList('commandZone')

          if (this.deckView === 'commandZone') {
            this.updateDeckView('mainDeck')
          }
        }

        this.saveDeck()
      },
      saveDeck () {
        this.deck.saveDeck()
      }
    }
  ),
  created () {
    this.$nextTick().then(() => {
      autosize(document.querySelector('textarea#deck-description'))
    })
  }
}
</script>

<style scoped>
#deck-name {
  position: relative;
}

#deck-name input {
  text-align: center;
  font-size: 2em;
}

#deck-description {
  resize: none;
}

#settings-button {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 9;
}
</style>
