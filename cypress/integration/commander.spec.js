describe('Commander View', function () {
  beforeEach(function () {
    cy.start()
  })

  it('shows commander card in command zone', function () {
    cy.get('[data-cy="format-select"]').select('commander')

    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="new-card-input"]')
      .type('arjun, shif flame{enter}')

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
      .should('have.value', '1 Arjun, the Shifting Flame')

    cy.get('[data-cy="commander-secondary-menu-selection"]').click()

    cy.get('[data-cy="commander-view"] img').should('have.length', 1)

    cy.get('[data-cy="new-card-input"]')
      .type('Experiment Kraj{enter}')

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(1)
      .should('have.value', '1 Experiment Kraj')

    cy.get('[data-cy="commander-view"] img').should('have.length', 2)

    cy.get('[data-cy="new-card-input"]')
      .type('Teysa, Envoy{enter}')

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(2)
      .should('have.value', '1 Teysa, Envoy of Ghosts')

    cy.get('[data-cy="commander-view"] img').should('have.length', 3)
  })
})
