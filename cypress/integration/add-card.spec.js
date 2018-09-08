describe('Add Card', function () {
  beforeEach(function () {
    cy.start()
  })

  it('adds a card', function () {
    cy.get('[data-cy="new-card-input"]').type('Rishkar Exper').blur()

    cy.get('.card-input:first input').should('have.value', '1 Rishkar\'s Expertise')

    cy.reload()

    cy.get('[data-cy="mainDeck-sorcery"] .card-input input').should('have.value', '1 Rishkar\'s Expertise')
  })

  it('adds multiples of a card', function () {
    cy.get('[data-cy="new-card-input"]').type('23 island').blur()

    cy.get('.card-input:first input').should('have.value', '23 Island')
  })

  it('adds multiples of a card with optional "x"', function () {
    cy.get('[data-cy="new-card-input"]').type('23x island').blur()

    cy.get('.card-input:first input').should('have.value', '23 Island')
  })

  it('displays card errors', function () {
    cy.get('[data-cy="new-card-input"]').type('23x F').blur()

    cy.get('.card-input:first input').should('have.value', '23 F')
    cy.get('.card-input:first .card-lookup-error').should('be.visible')
  })

  it('adds many cards', function () {
    cy.get('[data-cy="new-card-input"]')
      .type('Rishkar Exper{enter}')
      .type('Rashmi, Eternities Cr{enter}')
      .type('13 forest{enter}')

    cy.get('[data-cy="mainDeck-list"] .card-input input').eq(0)
      .should('have.value', '1 Rishkar\'s Expertise')

    cy.get('[data-cy="mainDeck-list"] .card-input input').eq(1)
      .should('have.value', '1 Rashmi, Eternities Crafter')

    cy.get('[data-cy="mainDeck-list"] .card-input input').eq(2)
      .should('have.value', '13 Forest')

    cy.reload()

    cy.get('[data-cy="mainDeck-sorcery"] .card-input input').should('have.value', '1 Rishkar\'s Expertise')

    cy.get('[data-cy="mainDeck-creature"] .card-input input').should('have.value', '1 Rashmi, Eternities Crafter')

    cy.get('[data-cy="mainDeck-land"] .card-input input').should('have.value', '13 Forest')
  })

  it('can add cards to sideboard', function () {
    cy.get('[data-cy="sideboard-selection"]').click()

    cy.get('[data-cy="new-card-input"]')
      .type('Rishkar Exper{enter}')
      .type('Rashmi, Eternities Cr{enter}')
      .type('13 forest{enter}')

    cy.get('[data-cy="sideboard-list"] .card-input input').eq(0)
      .should('have.value', '1 Rishkar\'s Expertise')

    cy.get('[data-cy="sideboard-list"] .card-input input').eq(1)
      .should('have.value', '1 Rashmi, Eternities Crafter')

    cy.get('[data-cy="sideboard-list"] .card-input input').eq(2)
      .should('have.value', '13 Forest')

    cy.reload()

    cy.get('[data-cy="sideboard-selection"]').click()

    cy.get('[data-cy="sideboard-sorcery"] .card-input input').should('have.value', '1 Rishkar\'s Expertise')

    cy.get('[data-cy="sideboard-creature"] .card-input input').should('have.value', '1 Rashmi, Eternities Crafter')

    cy.get('[data-cy="sideboard-land"] .card-input input').should('have.value', '13 Forest')
  })

  it('can add cards to command zone', function () {
    cy.get('[data-cy="format-select"]').select('commander')
    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="new-card-input"]')
      .type('Reyhan, last of{enter}')
      .type('Ravo, Sou Tend{enter}')

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(0)
      .should('have.value', '1 Reyhan, Last of the Abzan')

    cy.get('[data-cy="commandZone-list"] .card-input input').eq(1)
      .should('have.value', '1 Ravos, Soultender')

    cy.reload()

    cy.get('[data-cy="commandZone-selection"]').click()

    cy.get('[data-cy="commandZone-creature"] .card-input input').eq(0)
      .should('have.value', '1 Ravos, Soultender')

    cy.get('[data-cy="commandZone-creature"] .card-input input').eq(1)
      .should('have.value', '1 Reyhan, Last of the Abzan')
  })

  it('can add new cards by clicking the Add New button', function () {
    // make it so add new button is available by having at least one card in deck
    cy.get('[data-cy="new-card-input"]').type('4 Hostage Taker{enter}')
    cy.get('[data-cy="mainDeck-clean-up"] .tag').click()

    cy.get('[data-cy="focus-add-new-button"]').click()

    cy.focused().should('have.id', 'mainDeck-new-card').type('1 Myr Retriev{enter}')

    cy.get('[data-cy="mainDeck-clean-up"] .card-input input').should('have.value', '1 Myr Retriever')
  })
})
