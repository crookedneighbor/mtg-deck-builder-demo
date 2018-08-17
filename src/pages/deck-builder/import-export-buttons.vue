<template>
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
</template>

<script>
const {mapActions, mapGetters, mapState} = require('vuex')
const constructComputedMethodsForDeck = require('../../lib/construct-computed-methods-for-deck')

export default {
  data() {
    return {
      exportedDeck: '',
      importError: ''
    }
  },
  computed: Object.assign(
    constructComputedMethodsForDeck([
      'name',
    ]),
    {
      downloadFileName() {
        return `${this.name} - ${(new Date()).toString()}`
      }
    }
  ),
  methods: Object.assign(
    mapActions(['deleteDeck', 'saveDeck']),
    {
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

            this.$emit('close-modal')
          } catch (e) {
            this.importError = 'Something went wrong when importing the deck. Be sure you used a file that you exported from this app.'
          }
        }, false)

        reader.readAsText(file)
      }
    }
  )
}
</script>

<style scoped>
#import-deck-file-input {
  display: none;
}
</style>
