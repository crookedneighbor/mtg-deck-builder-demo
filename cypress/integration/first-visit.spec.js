describe('First visit', function () {
  beforeEach(function () {
    cy.visit('http://localhost:8080')
  })

  it('shows first visit prompt on first visit', function () {
    cy.get('[data-cy="first-time-modal"] .button').click()
  })

  it('does not show first time prompt if a deck is saved', function () {
    cy.get('[data-cy="first-time-modal"] .button').click()

    cy.get('[data-cy="new-card-input"]').type('food chain').blur()

    cy.get('.card-input:first input').should('have.value', '1 Food Chain')

    cy.reload()

    cy.get('[data-cy="first-time-modal"] .button').should('not.exist')
  })

  it('shows the first time prompt if pages is reloaded after deleting deck', function () {
    cy.get('[data-cy="first-time-modal"] .button').click()

    cy.get('[data-cy="new-card-input"]').type('food chain').blur()

    cy.get('.card-input:first input').should('have.value', '1 Food Chain')

    cy.reload()

    cy.get('[data-cy="settings-button"]').click()
    cy.get('[data-cy="delete-button"]').click()

    cy.reload()

    cy.get('[data-cy="first-time-modal"] .button').should('exist')
  })
})
