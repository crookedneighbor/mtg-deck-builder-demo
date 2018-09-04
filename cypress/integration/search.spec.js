describe('Search', function () {
  beforeEach(function () {
    cy.start()
  })

  // this is too flaky from results not populating
  // fast enough. Figure out if something else needs
  // to be done or just adjust the timeout
  it.skip('paginates search results', function () {
    cy.get('[data-cy="search-input"]')
      .type('t:creature t:artifact{enter}')

    cy.get('[data-cy="search-results"] .search-result').should('have.length', 175)

    // looks up next page of results when scrolling to bottom
    cy.get('[data-cy="search-results"]').scrollTo('bottom')

    cy.get('[data-cy="search-results"] .search-result').should('have.length', 350)
  })

  it('can add search results to page', function () {
    // add to main deck
    cy.get('[data-cy="search-input"]')
      .type('saheeli the gifted{enter}')

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="mainDeck-list"] .card-input input').eq(0)
      .should('have.value', '1 Saheeli, the Gifted')

    // add to sideboard
    cy.get('[data-cy="sideboard-selection"]').click()

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="sideboard-list"] .card-input input').eq(0)
      .should('have.value', '1 Saheeli, the Gifted')

    // add to command zone
    cy.get('[data-cy="format-select"]').select('commander')

    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
      .should('have.value', '1 Saheeli, the Gifted')
  })

  it('displays search errors', function () {
    cy.get('[data-cy="search-input"]')
      .type('foobarbaz{enter}')

    cy.get('[data-cy="search-error"]').should('be.visible')

    // disapears when the delete button is clicked
    cy.get('[data-cy="search-error"] .delete').click()

    cy.get('[data-cy="search-error"]').should('not.be.visible')

    // disapears when a new search is done
    cy.get('[data-cy="search-input"]')
      .type('foobarbaz{enter}')

    cy.get('[data-cy="search-error"]').should('be.visible')

    cy.get('[data-cy="search-input"]')
      .clear()
      .type('Experiment{enter}')

    cy.get('[data-cy="search-error"]').should('not.be.visible')
  })
})
