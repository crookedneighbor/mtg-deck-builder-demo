describe('Update Card', function () {
  beforeEach(function () {
    cy.start('commander-deck-flashmi')
  })

  it('updates a card', function () {
    cy.get('.card-input:first input').should('not.have.value', '1 Rishkar\'s Expertise')

    cy.get('.card-input:first input').clear().type('Rishkar\'s Expert{enter}')
    cy.get('.card-input:first input').should('have.value', '1 Rishkar\'s Expertise')

    cy.reload()

    cy.get('.card-input:first input').should('have.value', '1 Rishkar\'s Expertise')

    // add tags
    cy.get('.card-input:first input').type(' #card_draw #cheat_mana_cost{enter}')
    cy.get('.card-input:first .tags .tag').should('have.length', 2)
    cy.get('.card-input:first .tags .tag').eq(0).contains('Card Draw')
    cy.get('.card-input:first .tags .tag').eq(1).contains('Cheat Mana Cost')

    cy.reload()

    cy.get('.card-input:first input').should('have.value', '1 Rishkar\'s Expertise')
    cy.get('.card-input:first .tags .tag').should('have.length', 2)
    cy.get('.card-input:first .tags .tag').eq(0).contains('Card Draw')
    cy.get('.card-input:first .tags .tag').eq(1).contains('Cheat Mana Cost')

    // check that text version of tags are displayed when in focus
    cy.get('.card-input:first input').click().should('have.value', '1 Rishkar\'s Expertise #card_draw #cheat_mana_cost')

    // update quantity
    cy.get('.card-input:first input').type('{selectall}{leftarrow}{del}25{enter}')
    cy.get('.card-input:first input').should('have.value', '25 Rishkar\'s Expertise')
  })

  // Need to figure out how best to assert that a request was made
  // when the underlying request is using fetch, which Cypress
  // does not yet support
  // https://github.com/cypress-io/cypress/issues/95
  it('updates a card without making unnecessary network requests')
})
