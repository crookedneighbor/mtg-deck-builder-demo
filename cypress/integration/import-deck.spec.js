// based on https://github.com/cypress-io/cypress/issues/170#issuecomment-311196166

const VERSION = require('../../src/lib/constants').VERSION

describe('Import Deck', function () {
  beforeEach(function () {
    cy.start()
  })

  it('imports deck for mtg deck builder', function () {
    let dataTransfer = new DataTransfer()

    return cy.fixture('commander-deck-flashmi').then((deck) => {
      deck.__VERSION = VERSION
      let deckAsString = JSON.stringify(deck)
      let deckFile = new File([deckAsString], 'deck.json')

      dataTransfer.items.add(deckFile)

      cy.get('[data-cy="settings-button"]').click()

      return cy.get('[data-cy="import-input"]')
    }).then((el) => {
      el[0].files = dataTransfer.files
    }).then(() => {
      cy.get('[data-cy="deck-name-input"]').should('have.value', 'Flashmi')
      cy.get('[data-cy="deck-description-input"]').should('have.value', 'Play big dumb creatures on every person\'s turn!')
      cy.get('[data-cy="format-select"]').should('have.value', 'commander')
      cy.get('[data-cy="mainDeck-list"] .card-input input').eq(0)
        .should('have.value', '1 Alchemist\'s Refuge')

      cy.get('[data-cy="mainDeck-list"] .card-input').should('have.length', 82)

      cy.get('[data-cy="commandZone-selection"]').click()

      cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
        .should('have.value', '1 Rashmi, Eternities Crafter')
    })
  })

  it('imports deck and re-fetches cards if VERSION is old', function () {
    let dataTransfer = new DataTransfer()

    return cy.fixture('limited-deck-some-dom-rares').then((deck) => {
      let deckAsString = JSON.stringify(deck)
      let deckFile = new File([deckAsString], 'deck.json')

      dataTransfer.items.add(deckFile)

      cy.get('[data-cy="settings-button"]').click()

      return cy.get('[data-cy="import-input"]')
    }).then((el) => {
      el[0].files = dataTransfer.files
    }).then(() => {
      cy.get('[data-cy="deck-update-in-progress-modal"]').contains('Deck Update in Progress:')
      cy.get('[data-cy="deck-update-in-progress-modal"]').should('not.be.visible')

      cy.get('[data-cy="deck-name-input"]').should('have.value', 'Rares!')
      cy.get('[data-cy="deck-description-input"]').should('have.value', 'Some rares I got.')
      cy.get('[data-cy="format-select"]').should('have.value', 'limited')
      cy.get('[data-cy="mainDeck-list"] .card-input input').eq(0)
        .should('have.value', '1 Aryel, Knight of Windgrace')
    })
  })

  it('imports deck from tappedout.net', function () {
    let dataTransfer = new DataTransfer()

    return cy.fixture('tappedout.net-sample-deck.txt').then((deckAsString) => {
      let deckFile = new File([deckAsString], 'tappedout.net-sample-deck.txt')

      dataTransfer.items.add(deckFile)

      cy.get('[data-cy="settings-button"]').click()

      cy.get('[data-cy="import-select"]').select('tappedout')

      return cy.get('[data-cy="import-input"]')
    }).then((el) => {
      el[0].files = dataTransfer.files
    }).then(() => {
      cy.get('[data-cy="deck-name-input"]').should('have.value', '')
      cy.get('[data-cy="deck-description-input"]').should('have.value', '')
      cy.get('[data-cy="format-select"]').should('have.value', 'commander')
      cy.get('[data-cy="mainDeck-list"] .card-input input').eq(0)
        .should('have.value', '1 Acidic Slime')

      cy.get('[data-cy="mainDeck-list"] .card-input').should('have.length', 2)

      cy.get('[data-cy="commandZone-selection"]').click()

      cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
        .should('have.value', '1 Rashmi, Eternities Crafter')
    })
  })
})
