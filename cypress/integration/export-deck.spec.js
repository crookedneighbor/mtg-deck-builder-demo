// tests adapted from https://github.com/cypress-io/cypress/issues/949#issuecomment-400252677

describe('Export Deck', function () {
  beforeEach(function () {
    cy.start()
  })

  it('can export as json', function () {
    cy.get('[data-cy="deck-name-input"]').type('Deck To Export')

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

      expect(deck.name).to.equal('Deck To Export')
    })
  })
})
