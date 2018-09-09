describe('Search', function () {
  beforeEach(function () {
    cy.start()
  })

  it('paginates search results', function () {
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

    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').eq(0)
      .should('have.value', '1 Saheeli, the Gifted')

    // add to sideboard
    cy.get('[data-cy="sideboard-selection"]').click()

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="sideboard-clean-up"] .card-input input').eq(0)
      .should('have.value', '1 Saheeli, the Gifted')

    // add to command zone
    cy.get('[data-cy="format-select"]').select('commander')

    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="commandZone-clean-up"] .card-input input').eq(0)
      .should('have.value', '1 Saheeli, the Gifted')
  })

  it('applies active tags to search results', function () {
    // add cards with tags
    cy.get('[data-cy="new-card-input"]').type('4 Rite of Repl #win_condition #token_copy{enter}')
    cy.get('[data-cy="new-card-input"]').type('2 Cackl Counterpar #token_copy{enter}')
    cy.get('[data-cy="new-card-input"]').type('3 Muldrifter #card_draw{enter}')

    // activate tags
    cy.get('[data-cy="tag-choices"] .tags .tag').eq(0).click()
    cy.get('[data-cy="tag-choices"] .tags .tag').eq(1).click()

    cy.get('[data-cy="search-input"]').type('Arcane Artisa{enter}')

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').eq(3)
      .click()
      .should('have.value', '1 Arcane Artisan #card_draw #token_copy')
  })

  it('can add multiples to deck list', function () {
    // add to main deck
    cy.get('[data-cy="search-input"]')
      .type('Temur Sabertooth{enter}')

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').eq(0)
      .should('have.value', '1 Temur Sabertooth')
    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()

    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').eq(0)
      .should('have.value', '2 Temur Sabertooth')

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()
    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').eq(0)
      .should('have.value', '3 Temur Sabertooth')

    cy.get('[data-cy="search-input"]')
      .clear()
      .type('Arcades{enter}')

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()
    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(1).click()

    cy.get('[data-cy="search-input"]')
      .clear()
      .type('Temur Sabertooth{enter}')

    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').eq(0).click()
    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').eq(0)
      .should('have.value', '4 Temur Sabertooth')
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
