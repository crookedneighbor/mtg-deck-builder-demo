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

  it('updates card quantity without making unnecessary network requests', function () {
    cy.get('.card-input:first input').should('have.value', '1 Alchemist\'s Refuge')

    // update quantity
    cy.get('.card-input:first input').type('{selectall}{leftarrow}{del}25').blur()
    cy.get('.card-input:first input').should('have.value', '25 Alchemist\'s Refuge')

    cy.wait(100)

    cy.window().its('fetch').should('not.be.called')
  })

  it('updates card tags without making unnecessary network requests if name does not change', function () {
    cy.get('.card-input:first input').should('have.value', '1 Alchemist\'s Refuge')

    // update quantity
    cy.get('.card-input:first input').type('{backspace}e{selectall}{rightarrow}{backspace}{backspace}{backspace}{backspace}mana_source').blur()
    cy.get('.card-input:first input').should('have.value', '1 Alchemist\'s Refuge')

    cy.wait(100)

    cy.get('.card-input:first .tags .tag').should('have.length', 2)
    cy.get('.card-input:first .tags .tag').eq(0).contains('Flash')
    cy.get('.card-input:first .tags .tag').eq(1).contains('Mana Source')

    cy.window().its('fetch').should('not.be.called')
  })
})
