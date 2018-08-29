// preloads site with deck, defaults to an empty deck
Cypress.Commands.add('start', (deckName = 'empty-deck') => {
  cy.fixture(deckName).then((deck) => {
    let deckAsString = JSON.stringify(deck)

    cy.visit('http://localhost:8080', {
      onBeforeLoad (win) {
        win.localStorage.setItem('deck', deckAsString)
      }
    })
  })
})
