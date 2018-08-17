describe('Deck Details', function () {
  beforeEach(function () {
    cy.start()
  })

  it('adds save-able deck name', function () {
    const name = '[data-cy="deck-name-input"]'

    cy.get(name).type('Deck Name').blur()

    cy.get(name).should('have.value', 'Deck Name')

    cy.reload()

    cy.get(name).should('have.value', 'Deck Name')
  })

  it('adds save-able deck description', function () {
    const description = '[data-cy="deck-description-input"]'

    cy.get(description).type('Deck description').blur()

    cy.get(description).should('have.value', 'Deck description')

    cy.reload()

    cy.get(description).should('have.value', 'Deck description')
  })

  it('can set format in settings modal', function () {
    cy.get('[data-cy="settings-button"]').click()

    cy.get('[data-cy="format-select"]').select('frontier')

    cy.reload()

    cy.get('[data-cy="settings-button"]').click()

    cy.get('[data-cy="format-select"]').should('have.value', 'frontier')
  })
})
