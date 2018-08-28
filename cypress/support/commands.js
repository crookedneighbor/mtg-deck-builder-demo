// dismisses the first time visit modal
Cypress.Commands.add('start', () => {
  cy.visit('http://localhost:8080')
  cy.get('[data-cy="first-time-modal"] .modal-close').click()
})
