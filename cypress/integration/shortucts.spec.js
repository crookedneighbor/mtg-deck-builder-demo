describe('Shortcuts', function () {
  beforeEach(function () {
    cy.start()
  })

  // See https://github.com/cypress-io/cypress/issues/2105#issuecomment-416593221
  it.skip('opens a modal to display shortcuts', function () {
    cy.get('body').type('?')

    cy.get('[data-cy="shortcut-list"]').should('be.visible')
  })

  it('can focus on add new card input', function () {
    cy.get('body').type('a')

    cy.focused().should('have.id', 'mainDeck-new-card')

    cy.get('[data-cy="sideboard-selection"]').click()

    cy.get('body').type('a')

    cy.focused().should('have.id', 'sideboard-new-card')

    cy.get('[data-cy="format-select"]').select('commander')
    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('body').type('a')

    cy.focused().should('have.id', 'commandZone-new-card')
  })

  it('can focus on search input', function () {
    cy.get('body').type('s')

    cy.focused().should('have.id', 'search-input')

    // for some reason, the / key isn't being recognized
    // see https://github.com/cypress-io/cypress/issues/2105#issuecomment-416593221
    // cy.focused().blur()
    //
    // cy.get('body').type('/')
    //
    // cy.focused().should('have.id', 'search-input')

    // focuses on search even when commander view is enabled

    cy.get('[data-cy="format-select"]').select('commander')
    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="new-card-input"]')
      .type('arjun, shif flame{enter}')

    cy.get('[data-cy="commander-secondary-menu-selection"]').click()

    cy.get('body').type('s')

    cy.focused().should('have.id', 'search-input')
  })

  it('can move between deck views', function () {
    cy.get('[data-cy="mainDeck-list"]').should('be.visible')
    cy.get('[data-cy="sideboard-list"]').should('not.be.visible')

    cy.get('body').type('t')

    cy.get('[data-cy="sideboard-list"]').should('be.visible')
    cy.get('[data-cy="mainDeck-list"]').should('not.be.visible')

    cy.get('body').type('t')

    cy.get('[data-cy="mainDeck-list"]').should('be.visible')
    cy.get('[data-cy="sideboard-list"]').should('not.be.visible')

    cy.get('[data-cy="format-select"]').select('commander')

    cy.get('[data-cy="mainDeck-list"]').should('be.visible')
    cy.get('[data-cy="commandZone-list"]').should('not.be.visible')
    cy.get('[data-cy="sideboard-list"]').should('not.be.visible')

    cy.get('body').type('t')

    cy.get('[data-cy="mainDeck-list"]').should('not.be.visible')
    cy.get('[data-cy="commandZone-list"]').should('be.visible')
    cy.get('[data-cy="sideboard-list"]').should('not.be.visible')

    cy.get('body').type('t')

    cy.get('[data-cy="mainDeck-list"]').should('not.be.visible')
    cy.get('[data-cy="commandZone-list"]').should('not.be.visible')
    cy.get('[data-cy="sideboard-list"]').should('be.visible')

    cy.get('body').type('t')

    cy.get('[data-cy="mainDeck-list"]').should('be.visible')
    cy.get('[data-cy="commandZone-list"]').should('not.be.visible')
    cy.get('[data-cy="sideboard-list"]').should('not.be.visible')
  })
})
