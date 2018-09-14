<template>
  <div>
    <div>
      <div class="select">
        <select data-cy="export-select" v-model="exportType">
          <option value="us">Export for this site</option>
          <option value="tappedout">Export for TappedOut.net</option>
        </select>
      </div>

      <a data-cy="export-link" :href="exportedDeck" :download="downloadFileName" target="_blank">
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

      <input data-cy="import-input" id="import-deck-file-input" type='file' accept='text/plain, application/json' @change="importDeck">
    </div>
  </div>
</template>

<script>
const {mapActions, mapMutations, mapState} = require('vuex')
const extractCardInput = require('../../../lib/extract-card-input')

const TAPPEDOUT_COMMANDER_SYMBOL = ' *CMDR*'

function formatDeckExportForTappedOut (deck) {
  let cards = []

  function formatCardForTappedOut (card) {
    return `${card.quantity} ${card.name}`
  }

  function addToCards (list, transform) {
    Object.keys(list).forEach((cardId) => {
      let card = list[cardId]
      let transformedCard = formatCardForTappedOut(card)

      if (transform) {
        transformedCard = transform(transformedCard)
      }

      cards.push(transformedCard)
    })
  }

  addToCards(deck.mainDeck)
  addToCards(deck.commandZone, (card) => {
    return card + TAPPEDOUT_COMMANDER_SYMBOL
  })

  if (Object.keys(deck.sideboard).length > 0) {
    cards.push('\nSideboard:')
    addToCards(deck.sideboard)
  }

  return cards.join('\n')
}

function formatDeckImportForTappedOut (textFile) {
  let atSideboard = false
  let deck = {
    mainDeck: {},
    sideboard: {},
    commandZone: {}
  }

  textFile.split('\n').forEach((rawLine) => {
    let line = rawLine.replace(/[^\u0000-\u007E]/g, '').trim() // eslint-disable-line no-control-regex
    let isCommander = line.indexOf(TAPPEDOUT_COMMANDER_SYMBOL) > -1

    if (!line) {
      return
    }

    if (line === 'Sideboard:') {
      atSideboard = true
      return
    }

    let card = extractCardInput(line)

    card.lookupInProgress = true
    card.needsCleanup = true

    if (atSideboard) {
      deck.sideboard[card.id] = card
    } else {
      if (isCommander) {
        deck.format = 'commander'
        deck.commandZone[card.id] = card
      } else {
        deck.mainDeck[card.id] = card
      }
    }
  })

  return deck
}

export default {
  data () {
    return {
      exportedDeck: '',
      importError: '',
      importType: 'us',
      exportType: 'us'
    }
  },
  computed: Object.assign(
    mapState(['deck']),
    {
      downloadFileName () {
        let name = `${this.deck.name} - ${(new Date()).toString()}`

        if (this.exportType === 'us') {
          name = name + '.json'
        }

        return name
      }
    }
  ),
  methods: Object.assign(
    mapActions(['deleteDeck']),
    mapMutations(['updateDeckView']),
    {
      prepareExport () {
        let deck

        if (this.exportedDeck) {
          window.URL.revokeObjectURL(this.exportedDeck)
        }

        if (this.exportType === 'us') {
          deck = JSON.stringify(this.deck)
        } else if (this.exportType === 'tappedout') {
          deck = formatDeckExportForTappedOut(this.deck)
        }

        let data = new Blob([deck], {type: 'text/plain'})

        this.exportedDeck = window.URL.createObjectURL(data)
      },
      prepareImport () {
        this.importError = ''

        let file = document.querySelector('#import-deck-file-input')

        file.click()
      },
      importDeck (event) {
        let reader = new FileReader()
        let file = document.querySelector('#import-deck-file-input').files[0]

        if (!file || !window.confirm('This will overwrite the current deck. Are you sure you want to do this?')) {
          return
        }

        reader.addEventListener('load', () => {
          let parsedDeck

          try {
            if (this.importType === 'us') {
              parsedDeck = JSON.parse(reader.result)
            } else if (this.importType === 'tappedout') {
              parsedDeck = formatDeckImportForTappedOut(reader.result)

              if (parsedDeck.commandZone.length > 0) {
                // assume commander format if a commander is found
                parsedDeck.format = 'commander'
              }
            }

            this.deleteDeck()
            this.deck.updateDeck(parsedDeck)
            this.updateDeckView('mainDeck')
            this.$emit('close-modal')
            this.deck.cleanUp()
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
