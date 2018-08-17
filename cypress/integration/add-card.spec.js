describe.skip('Add Card', function () {
  // TODO: mock requests to scryfall
  beforeEach(function () {
    cy.start()
  })

  it('adds a card', function () {
    cy.get('[data-cy="new-card-input"]').type('Rishkar Exper').blur()

    cy.get('.card-input:first input').should('have.value', '1 Rishkar\'s Expertise')

    cy.reload()

    cy.get('.card-input:first input').should('have.value', '1 Rishkar\'s Expertise')
  })

  it('adds multiples of a card', function () {
    cy.get('[data-cy="new-card-input"]').type('23 Island').blur()

    cy.get('.card-input:first input').should('have.value', '23 Island')
  })

  it('adds multiples of a card with optional "x"', function () {
    cy.get('[data-cy="new-card-input"]').type('23x Island').blur()

    cy.get('.card-input:first input').should('have.value', '23 Island')
  })
})
