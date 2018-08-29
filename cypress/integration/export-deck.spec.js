// tests adapted from https://github.com/cypress-io/cypress/issues/949#issuecomment-400252677

describe('Export Deck', function () {
  beforeEach(function () {
    cy.start('commander-deck-flashmi')
  })

  it('can export as json', function () {
    cy.get('[data-cy="settings-button"]').click()

    cy.get('[data-cy="export-button"]').trigger('mouseover')

    // wait for deck to be exported
    cy.wait(1)

    cy.get('[data-cy="export-link"]').then((anchor) => {
      return new Promise((resolve, reject) => {
        // Use XHR to get the blob that corresponds to the object URL.
        const xhr = new XMLHttpRequest()
        xhr.open('GET', anchor.prop('href'), true)
        xhr.responseType = 'blob'

        // Once loaded, use FileReader to get the string back from the blob.
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response
            const reader = new FileReader()
            reader.onload = () => {
              // Once we have a string, resolve the promise to let
              // the Cypress chain continue, e.g. to assert on the result.
              resolve(reader.result)
            }
            reader.readAsText(blob)
          }
        }
        xhr.send()
      })
    }).then((deckString) => {
      let deck = JSON.parse(deckString)

      expect(deck.name).to.equal('Flashmi')
      expect(deck.description).to.equal('Play big dumb creatures on every person\'s turn!')
      expect(deck.format).to.equal('commander')

      let numberOfCardsInMainDeck = deck.mainDeck.reduce((count, card) => {
        count = count + card.quantity
        return count
      }, 0)

      expect(numberOfCardsInMainDeck).to.equal(99)
      expect(deck.mainDeck[0].name).to.equal('Acidic Slime')
      expect(deck.commandZone).to.have.length(1)
      expect(deck.commandZone[0].name).to.equal('Rashmi, Eternities Crafter')
    })
  })

  it('can export for tappedout.net', function () {
    cy.get('[data-cy="settings-button"]').click()

    cy.get('[data-cy="export-select"]').select('tappedout')
    cy.get('[data-cy="export-button"]').trigger('mouseover')

    // wait for deck to be exported
    cy.wait(1)

    cy.get('[data-cy="export-link"]').then((anchor) => {
      return new Promise((resolve, reject) => {
        // Use XHR to get the blob that corresponds to the object URL.
        const xhr = new XMLHttpRequest()
        xhr.open('GET', anchor.prop('href'), true)
        xhr.responseType = 'blob'

        // Once loaded, use FileReader to get the string back from the blob.
        xhr.onload = () => {
          if (xhr.status === 200) {
            const blob = xhr.response
            const reader = new FileReader()
            reader.onload = () => {
              // Once we have a string, resolve the promise to let
              // the Cypress chain continue, e.g. to assert on the result.
              resolve(reader.result)
            }
            reader.readAsText(blob)
          }
        }
        xhr.send()
      })
    }).then((deckString) => {
      let deck = deckString.split('\n')

      expect(deck[0]).to.equal('1 Acidic Slime')
      expect(deck[deck.length - 4]).to.equal('1 Rashmi, Eternities Crafter *CMDR*')
      expect(deck[deck.length - 2]).to.equal('Sideboard:')
      expect(deck[deck.length - 1]).to.equal('1 Food Chain')
    })
  })
})
