describe('Grouping Cards', function () {
  beforeEach(function () {
    cy.start('commander-deck-flashmi')
  })

  it('defaults to grouping by type and sorting by name', function () {
    cy.get('[data-cy="group-by-choice"]').should('have.value', 'card-type')
    cy.get('[data-cy="sort-by-choice"]').should('have.value', 'name')
  })

  it('does not show group and sort options in empty deck', function () {
    cy.get('[data-cy="settings-button"]').click()
    cy.get('[data-cy="delete-button"]').click()

    cy.get('[data-cy="group-by-choice"]').should('not.exist')
    cy.get('[data-cy="sort-by-choice"]').should('not.exist')

    cy.get('[data-cy="new-card-input"]').type('4 Hostage Taker{enter}')

    cy.get('[data-cy="group-by-choice"]').should('not.exist')
    cy.get('[data-cy="sort-by-choice"]').should('not.exist')

    cy.get('[data-cy="mainDeck-clean-up"] .tag').click()

    cy.get('[data-cy="group-by-choice"]').should('exist')
    cy.get('[data-cy="sort-by-choice"]').should('exist')
  })

  it('groups by type', function () {
    cy.get('[data-cy="group-by-choice"]').select('card-type')

    cy.get('[data-cy="mainDeck-land"] th').contains('Lands')
    cy.get('[data-cy="mainDeck-land"] .card-row').should('have.length', 19)
    cy.get('[data-cy="mainDeck-creature"] th').contains('Creatures')
    cy.get('[data-cy="mainDeck-creature"] .card-row').should('have.length', 28)
    cy.get('[data-cy="mainDeck-artifact"] th').contains('Artifacts')
    cy.get('[data-cy="mainDeck-artifact"] .card-row').should('have.length', 10)
    cy.get('[data-cy="mainDeck-enchantment"] th').contains('Enchantments')
    cy.get('[data-cy="mainDeck-enchantment"] .card-row').should('have.length', 9)
    cy.get('[data-cy="mainDeck-planeswalker"] th').contains('Planeswalkers')
    cy.get('[data-cy="mainDeck-planeswalker"] .card-row').should('have.length', 1)
    cy.get('[data-cy="mainDeck-instant"] th').contains('Instants')
    cy.get('[data-cy="mainDeck-instant"] .card-row').should('have.length', 9)
    cy.get('[data-cy="mainDeck-sorcery"] th').contains('Sorceries')
    cy.get('[data-cy="mainDeck-sorcery"] .card-row').should('have.length', 6)
  })

  it('groups by converted mana cost', function () {
    cy.get('[data-cy="group-by-choice"]').select('converted-mana-cost')

    cy.get('[data-cy="mainDeck-cmc-0"] th').contains('0 CMC')
    cy.get('[data-cy="mainDeck-cmc-0"] .card-row').should('have.length', 19)
    cy.get('[data-cy="mainDeck-cmc-1"] th').contains('1 CMC')
    cy.get('[data-cy="mainDeck-cmc-1"] .card-row').should('have.length', 5)
    cy.get('[data-cy="mainDeck-cmc-2"] th').contains('2 CMC')
    cy.get('[data-cy="mainDeck-cmc-2"] .card-row').should('have.length', 17)
    cy.get('[data-cy="mainDeck-cmc-3"] th').contains('3 CMC')
    cy.get('[data-cy="mainDeck-cmc-3"] .card-row').should('have.length', 12)
    cy.get('[data-cy="mainDeck-cmc-4"] th').contains('4 CMC')
    cy.get('[data-cy="mainDeck-cmc-4"] .card-row').should('have.length', 8)
    cy.get('[data-cy="mainDeck-cmc-5"] th').contains('5 CMC')
    cy.get('[data-cy="mainDeck-cmc-5"] .card-row').should('have.length', 9)
    cy.get('[data-cy="mainDeck-cmc-6"] th').contains('6 CMC')
    cy.get('[data-cy="mainDeck-cmc-6"] .card-row').should('have.length', 6)
    cy.get('[data-cy="mainDeck-cmc-7"] th').contains('7 CMC')
    cy.get('[data-cy="mainDeck-cmc-7"] .card-row').should('have.length', 2)
    cy.get('[data-cy="mainDeck-cmc-8"] th').contains('8 CMC')
    cy.get('[data-cy="mainDeck-cmc-8"] .card-row').should('have.length', 3)
    cy.get('[data-cy="mainDeck-cmc-9"] th').contains('9 CMC')
    cy.get('[data-cy="mainDeck-cmc-9"] .card-row').should('have.length', 1)
  })

  it('groups by color', function () {
    cy.get('[data-cy="group-by-choice"]').select('color')

    cy.get('[data-cy="mainDeck-color-U"] th').contains('Blue')
    cy.get('[data-cy="mainDeck-color-U"] .card-row').should('have.length', 17)
    cy.get('[data-cy="mainDeck-color-G"] th').contains('Green')
    cy.get('[data-cy="mainDeck-color-G"] .card-row').should('have.length', 18)
    cy.get('[data-cy="mainDeck-color-gold"] th').contains('Multicolored')
    cy.get('[data-cy="mainDeck-color-gold"] .card-row').should('have.length', 15)
    cy.get('[data-cy="mainDeck-color-colorless"] th').contains('Colorless')
    cy.get('[data-cy="mainDeck-color-colorless"] .card-row').should('have.length', 32)
  })

  it('groups by color identity', function () {
    cy.get('[data-cy="group-by-choice"]').select('color-identity')

    cy.get('[data-cy="mainDeck-color-identity-U"] th').contains('Blue')
    cy.get('[data-cy="mainDeck-color-identity-U"] .card-row').should('have.length', 21)
    cy.get('[data-cy="mainDeck-color-identity-G"] th').contains('Green')
    cy.get('[data-cy="mainDeck-color-identity-G"] .card-row').should('have.length', 21)
    cy.get('[data-cy="mainDeck-color-identity-GU"] th').contains('Simic')
    cy.get('[data-cy="mainDeck-color-identity-GU"] .card-row').should('have.length', 22)
    cy.get('[data-cy="mainDeck-color-identity-colorless"] th').contains('Colorless')
    cy.get('[data-cy="mainDeck-color-identity-colorless"] .card-row').should('have.length', 18)
  })

  it('groups by tags', function () {
    cy.get('[data-cy="group-by-choice"]').select('tags')

    cy.get('[data-cy="mainDeck-tag-card_draw"] th').contains('Card Draw')
    cy.get('[data-cy="mainDeck-tag-card_draw"] .card-row').should('have.length', 5)
    cy.get('[data-cy="mainDeck-tag-cheat_mana_cost"] th').contains('Cheat Mana Cost')
    cy.get('[data-cy="mainDeck-tag-cheat_mana_cost"] .card-row').should('have.length', 8)
    cy.get('[data-cy="mainDeck-tag-deck_manipulation"] th').contains('Deck Manipulation')
    cy.get('[data-cy="mainDeck-tag-deck_manipulation"] .card-row').should('have.length', 6)
  })

  it('allows no grouping', function () {
    cy.get('[data-cy="group-by-choice"]').select('no-grouping')

    cy.get('[data-cy="mainDeck-no-grouping"] th').contains('Cards')
    cy.get('[data-cy="mainDeck-no-grouping"] .card-row').should('have.length', 82)
  })

  it('sorts by name', function () {
    cy.get('[data-cy="group-by-choice"]').select('card-type')
    cy.get('[data-cy="sort-by-choice"]').select('name')

    cy.get('[data-cy="mainDeck-land"] .card-row input').eq(0).should('have.value', '1 Alchemist\'s Refuge')
    cy.get('[data-cy="mainDeck-land"] .card-row input').eq(1).should('have.value', '1 Botanical Sanctum')
    cy.get('[data-cy="mainDeck-land"] .card-row input').eq(17).should('have.value', '1 Terramorphic Expanse')
    cy.get('[data-cy="mainDeck-land"] .card-row input').eq(18).should('have.value', '1 Thornwood Falls')

    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(0).should('have.value', '1 Acidic Slime')
    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(1).should('have.value', '1 Altered Ego')
    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(26).should('have.value', '1 Trygon Predator')
    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(27).should('have.value', '1 Winged Coatl')

    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(0).should('have.value', '1 Brittle Effigy')
    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(1).should('have.value', '1 Crystal Ball')
    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(8).should('have.value', '1 Thought Vessel')
    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(9).should('have.value', '1 Vedalken Orrery')

    cy.get('[data-cy="group-by-choice"]').select('converted-mana-cost')

    cy.get('[data-cy="mainDeck-cmc-1"] .card-row input').eq(0).should('have.value', '1 Birds of Paradise')
    cy.get('[data-cy="mainDeck-cmc-1"] .card-row input').eq(1).should('have.value', '1 Brainstorm')
    cy.get('[data-cy="mainDeck-cmc-1"] .card-row input').eq(3).should('have.value', '1 Burgeoning')
    cy.get('[data-cy="mainDeck-cmc-1"] .card-row input').eq(4).should('have.value', '1 Sol Ring')

    cy.get('[data-cy="mainDeck-cmc-3"] .card-row input').eq(0).should('have.value', '1 As Foretold')
    cy.get('[data-cy="mainDeck-cmc-3"] .card-row input').eq(1).should('have.value', '1 Beast Within')
    cy.get('[data-cy="mainDeck-cmc-3"] .card-row input').eq(10).should('have.value', '1 Trygon Predator')
    cy.get('[data-cy="mainDeck-cmc-3"] .card-row input').eq(11).should('have.value', '1 Winged Coatl')

    cy.get('[data-cy="mainDeck-cmc-6"] .card-row input').eq(0).should('have.value', '1 Archetype of Imagination')
    cy.get('[data-cy="mainDeck-cmc-6"] .card-row input').eq(1).should('have.value', '1 Conduit of Ruin')
    cy.get('[data-cy="mainDeck-cmc-6"] .card-row input').eq(4).should('have.value', '1 River\'s Rebuke')
    cy.get('[data-cy="mainDeck-cmc-6"] .card-row input').eq(5).should('have.value', '1 Sagu Mauler')
  })

  it('sorts by converted mana cost', function () {
    cy.get('[data-cy="group-by-choice"]').select('card-type')
    cy.get('[data-cy="sort-by-choice"]').select('converted-mana-cost')

    // give time for deck to update
    cy.wait(1)

    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(0).should('have.value', '1 Birds of Paradise')
    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(1).should('have.value', '1 Kiora\'s Follower')
    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(26).should('have.value', '1 Colossus of Akros')
    cy.get('[data-cy="mainDeck-creature"] .card-row input').eq(27).should('have.value', '1 Artisan of Kozilek')

    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(0).should('have.value', '1 Brittle Effigy')
    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(1).should('have.value', '1 Sol Ring')
    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(8).should('have.value', '1 Nevinyrral\'s Disk')
    cy.get('[data-cy="mainDeck-artifact"] .card-row input').eq(9).should('have.value', '1 Vedalken Orrery')
  })
})
