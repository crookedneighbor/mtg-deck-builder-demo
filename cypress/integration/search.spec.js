describe('Search', function () {
  function expectFetchQuery (query) {
    cy.get('[data-cy="search-input"]').type('{enter}')
    cy.get('[data-cy="search-results"] .search-result .add-card-to-deck').should('exist')

    cy.window().its('fetch').should('be.calledWith', query)

    cy.window().then((win) => {
      win.fetch.reset()
    })
  }

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

  it('restricts search to commander\'s color identity', function () {
    cy.get('[data-cy="search-input"]').type('t:creature o:"+1/+1 counter"')

    // does not adhere to commander color if no format
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22')

    cy.get('[data-cy="format-select"]').select('frontier')
    // does not adhere to commander color if format is not commander or brawl
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22%20format%3Afrontier')

    cy.get('[data-cy="format-select"]').select('commander')

    // does not adhere to commander color if no commander in command zone
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22%20format%3Acommander')

    cy.get('[data-cy="commandZone-selection"]').click()
    cy.get('[data-cy="new-card-input"]')
      .type('Reyhan, last of{enter}')
    cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
      .should('have.value', '1 Reyhan, Last of the Abzan')

    // does adhere to commander color if commander in command zone
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22%20ids%3ABG%20format%3Acommander')

    cy.get('[data-cy="commandZone-selection"]').click()
    cy.get('[data-cy="new-card-input"]')
      .type('Ravo, Sou Tend{enter}')

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(1)
      .should('have.value', '1 Ravos, Soultender')

    // does adhere to commander color if multiple commanders in command zone
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22%20ids%3AWBG%20format%3Acommander')

    // adheres for brawl
    cy.get('[data-cy="format-select"]').select('brawl')

    cy.get('[data-cy="search-input"]').type('{enter}')

    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22%20ids%3AWBG%20format%3Abrawl')
  })

  it('restricts search to format', function () {
    cy.get('[data-cy="search-input"]').type('t:creature o:"+1/+1 counter"')

    // does not specify format if no format selected
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22')

    cy.get('[data-cy="format-select"]').select('limited')
    // does not specify format if limited is selected format
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22')

    cy.get('[data-cy="format-select"]').select('pauper')

    // does specify format
    expectFetchQuery('https://api.scryfall.com/cards/search?q=t%3Acreature%20o%3A%22%2B1%2F%2B1%20counter%22%20format%3Apauper')
  })
})
