describe('Export Deck', function () {
  beforeEach(function () {
    cy.start('commander-deck-flashmi')
  })

  it('can delete deck data', function () {
    // illustrate that card data is filled
    cy.get('[data-cy="deck-name-input"]').should('have.value', 'Flashmi')
    cy.get('[data-cy="deck-description-input"]').should('have.value', 'Play big dumb creatures on every person\'s turn!')
    cy.get('[data-cy="format-select"]').should('have.value', 'commander')
    cy.get('[data-cy="mainDeck-list"] .card-input input').eq(0)
      .should('have.value', '1 Alchemist\'s Refuge')

    cy.get('[data-cy="mainDeck-list"] .card-input').should('have.length', 82)

    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
      .should('have.value', '1 Rashmi, Eternities Crafter')

    cy.get('[data-cy="settings-button"]').click()
    cy.get('[data-cy="delete-button"]').click()

    cy.get('[data-cy="deck-name-input"]').should('have.value', '')
    cy.get('[data-cy="deck-description-input"]').should('have.value', '')
    cy.get('[data-cy="format-select"]').should('have.value', null)
    cy.get('[data-cy="mainDeck-list"] .card-input input').should('not.exist')

    cy.get('[data-cy="mainDeck-list"] .card-input').should('have.length', 0)

    cy.get('[data-cy="commandZone-selection"]').should('not.exist')
  })
})
