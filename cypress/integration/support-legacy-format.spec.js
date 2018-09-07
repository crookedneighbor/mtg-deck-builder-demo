describe('Support Legacy Format', function () {
  beforeEach(function () {
    cy.start('commander-deck-flashmi-array-format')
  })

  it('supports array format for data', function () {
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
