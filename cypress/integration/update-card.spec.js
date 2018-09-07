describe('Update Card', function () {
  beforeEach(function () {
    cy.start('commander-deck-flashmi')
  })

  it('updates a card', function () {
    cy.get('.card-input:first input').should('have.value', '1 Alchemist\'s Refuge')

    cy.get('.card-input:first input').clear().type('Academy Rui').blur()
    cy.get('[data-cy="mainDeck-clean-up"] .card-input:first input').should('have.value', '1 Academy Ruins')

    cy.reload()

    cy.get('.card-input:first input').should('have.value', '1 Academy Ruins')
    // add tags
    cy.get('.card-input:first input').type(' #land #artifact_recursion{enter}')
    cy.get('.card-input:first .tags .tag').should('have.length', 2)
    cy.get('.card-input:first .tags .tag').eq(0).contains('Land')
    cy.get('.card-input:first .tags .tag').eq(1).contains('Artifact Recursion')

    cy.reload()

    cy.get('.card-input:first input').should('have.value', '1 Academy Ruins')
    cy.get('.card-input:first .tags .tag').should('have.length', 2)
    cy.get('.card-input:first .tags .tag').eq(0).contains('Land')
    cy.get('.card-input:first .tags .tag').eq(1).contains('Artifact Recursion')

    // check that text version of tags are displayed when in focus
    cy.get('.card-input:first input').click().should('have.value', '1 Academy Ruins #land #artifact_recursion')

    // update quantity
    cy.get('.card-input:first input').type('{selectall}{leftarrow}{del}25{enter}')
    cy.get('.card-input:first input').should('have.value', '25 Academy Ruins')
  })

  // Need to figure out how best to assert that a request was made
  // when the underlying request is using fetch, which Cypress
  // does not yet support
  // https://github.com/cypress-io/cypress/issues/95
  it('updates a card without making unnecessary network requests')
})
