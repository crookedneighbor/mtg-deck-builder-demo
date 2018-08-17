<template>
  <div>
    <div>
      <div class="select">
        <select data-cy="export-select" v-model="exportType">
          <option value="us">Export for this site</option>
          <option value="tappedout">Export for TappedOut.net</option>
        </select>
      </div>

      <a :href="exportedDeck" :download="downloadFileName" target="_blank">
        <button data-cy="export-button" class="button is-info" @mouseover="prepareExport">Export Deck</button>
      </a>
    </div>

    <hr>

    <div>
      <div class="select">
        <select data-cy="import-select" v-model="importType">
          <option value="us">Import from this site</option>
          <option value="tappedout">Import from TappedOut.net</option>
        </select>
      </div>

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
  </div>
</template>

<script>
const {mapActions, mapGetters, mapState} = require('vuex')
const constructComputedMethodsForDeck = require('../../lib/construct-computed-methods-for-deck')
const extractCardInput = require('../../lib/extract-card-input')

const TAPPEDOUT_COMMANDER_SYMBOL = ' *CMDR*'

function formatDeckExportForTappedOut(deck) {
  let cards = []

  function formatCardForTappedOut(card) {
    return `${card.quantity} ${card.name}`
  }

  function addToCards(card) {
    cards.push(formatCardForTappedOut(card))
  }

  deck.mainDeck.forEach(addToCards)
  deck.commandZone.forEach((card) => {
    let formattedCard = formatCardForTappedOut(card)

    cards.push(formattedCard + TAPPEDOUT_COMMANDER_SYMBOL)
  })

  if (deck.sideboard.length > 0) {
    cards.push('\nSideboard:')
    deck.sideboard.forEach(addToCards)
  }

  return cards.join('\n')
}

function formatDeckImportForTappedOut(textFile) {
  let atSideboard = false
  let deck = {
    mainDeck: [],
    sideboard: [],
    commandZone: []
  }
 
  textFile.split('\n').forEach((rawLine) => {
    let line = rawLine.replace(/[^\u0000-\u007E]/g, '').trim()
    let isCommander = line.indexOf(TAPPEDOUT_COMMANDER_SYMBOL) > -1

    if (!line) {
      return
    }

    if (line === 'Sideboard:') {
      atSideboard = true
      return
    }

    let card = extractCardInput(line)

    card.loadInProgress = true

    if (atSideboard) {
      deck.sideboard.push(card)
    } else {
      if (isCommander) {
        deck.commandZone.push(card)
      } else {
        deck.mainDeck.push(card)
      }
    }
  })

  return deck
}

export default {
  data() {
    return {
      exportedDeck: '',
      importError: '',
      importType: 'us',
      exportType: 'us'
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
        let deck

        if (this.exportedDeck) {
          window.URL.revokeObjectURL(this.exportedDeck)
        }

        if (this.exportType === 'us') {
          deck = JSON.stringify(this.$store.state.deck)
        } else if (this.exportType === 'tappedout') {
          deck = formatDeckExportForTappedOut(this.$store.state.deck)
        }

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
            if (this.importType === 'use') {
              parsedDeck = JSON.parse(reader.result)
            } else if (this.importType === 'tappedout') {
              parsedDeck = formatDeckImportForTappedOut(reader.result)

              if (parsedDeck.commandZone.length > 0) {
                // assume commander format if a commander is found
                parsedDeck.format = 'commander'
              }
            }

            this.deleteDeck()
            this.$store.commit('updateDeck', parsedDeck)
            this.$store.dispatch('refetchPendingCards')
            this.$store.commit('updateDeckView', 'mainDeck')
            this.saveDeck()

            this.$emit('close-modal')
          } catch (e) {
            console.error(e)
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
