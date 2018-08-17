<template>
  <div id="deck-name" class="box">
    <button data-cy="settings-button" id="settings-button" class="button is-outlined is-small" @click="shouldShowSettingsModal = true">
      <i class="icon fa fa-sliders-h"></i>
      <span>Settings</span>
    </button>

    <input data-cy="deck-name-input" class="input hidden-input" v-model="name" @blur="saveDeck" @keydown.enter="saveDeck" placeholder="Deck Name"/>
    <textarea data-cy="deck-description-input" id="deck-description" class="input hidden-input" v-model="description" @blur="saveDeck" @keydown.enter="saveDeck" placeholder="Deck notes."/>

    <modal v-if="shouldShowSettingsModal" @close="closeSettingsModal">
      <label class="label">Format</label>
      <div class="select">
        <select data-cy="format-select" v-model="format" @change="onFormatChange">
          <option disabled selected value="">Format</option>
          <option value="brawl">Brawl</option>
          <option value="commander">Commander</option>
          <option value="frontier">Frontier</option>
          <option value ="legacy">Legacy</option>
          <option value ="limited">Limited</option>
          <option value ="modern">Modern</option>
          <option value ="pauper">Pauper</option>
          <option value ="standard">Standard</option>
          <option value="vintage">Vintage</option>
        </select>
      </div>

      <hr>
      <div>
        <a :href="exportedDeck" :download="downloadFileName" target="_blank">
          <button data-cy="export-button" class="button is-info" @mouseover="prepareExport">Export Deck</button>
        </a>

          <button data-cy="import-button" class="button is-info" @click="prepareImport">Import Deck</button>

          <div v-if="importError">
            <br>
            <div class="notification is-danger">
              <button class="delete" @click="importError = ''"></button>
              {{importError}}
            </div>
          </div>

        <input data-cy="import-input" id="import-deck-file-input" type='file' accept='text/plain' @change="importDeck">
      </div>

      <hr>

      <div>
        <button data-cy="delete-button" class="button is-danger is-large" @click="promptToDeleteDeck">Delete</button>
      </div>
    </modal>
  </div>
</template>

<script>
const autosize = require('autosize')
const {mapActions, mapGetters, mapState} = require('vuex')
const constructComputedMethodsForDeck = require('../../lib/construct-computed-methods-for-deck')

const Modal = require('../../components/modal.vue')

export default {
  components: {
    modal: Modal
  },
  data() {
    return {
      shouldShowSettingsModal: false,
      exportedDeck: '',
      importError: ''
    }
  },
  computed: Object.assign(
    constructComputedMethodsForDeck([
      'name',
      'description',
      'format',
    ]),
    mapGetters(['hasCommandZone']),
    mapState(['deckView']),
    {
      downloadFileName() {
        return `${this.name} - ${(new Date()).toString()}`
      }
    }
  ),
  methods: Object.assign(
    mapActions(['deleteDeck', 'saveDeck']),
    {
      closeSettingsModal() {
        this.shouldShowSettingsModal = false
      },
      prepareExport() {
        if (this.exportedDeck) {
          window.URL.revokeObjectURL(this.exportedDeck)
        }

        let deck = JSON.stringify(this.$store.state.deck)
        let data = new Blob([deck], {type: 'text/plain'})

        this.exportedDeck = window.URL.createObjectURL(data)
      },
      prepareImport() {
        this.importError = ''

        let file = document.querySelector('#import-deck-file-input')

        file.click()
      },
      importDeck(event) {
        let reader  = new FileReader()
        let file = document.querySelector('#import-deck-file-input').files[0]

        if (!file || !window.confirm('This will overwrite the current deck. Are you sure you want to do this?')) {
          return
        }

        reader.addEventListener('load', () => {
          let importedDeck = reader.result
          let parsedDeck

          try {
            parsedDeck = JSON.parse(reader.result)

            this.deleteDeck()
            this.$store.commit('updateDeck', parsedDeck)
            this.$store.dispatch('refetchPendingCards')
            this.saveDeck()

            this.closeSettingsModal()
          } catch (e) {
            this.importError = 'Something went wrong when importing the deck. Be sure you used a file that you exported from this app.'
          }
        }, false)

        reader.readAsText(file)
      },
      promptToDeleteDeck() {
        if (!window.confirm('Are you sure you want to delete this deck?')) {
          return
        }

        this.deleteDeck()

        this.shouldShowSettingsModal = false
      },
      onFormatChange(event) {
        this.$store.commit('updateDeck', {
          format: event.target.value
        })

        if (!this.hasCommandZone) {
          this.$store.commit('removeList', 'commandZone')

          if (this.deckView === 'commandZone') {
            this.$store.commit('updateDeckView', 'mainDeck')
          }
        }

        this.saveDeck()
      }
    }
  ),
  created() {
    setTimeout(function () {
      autosize(document.querySelector('textarea#deck-description'))
    }, 100)
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

#import-deck-file-input {
  display: none;
}
</style>
