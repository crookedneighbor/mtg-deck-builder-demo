module.exports = {
  // version to check when deciding if deck should be re-imported
  // from scryfall. This should be changed whenever there's a new
  // field added to the stored decks. For organizational puproses,
  // the naming convention is YYYY-MM-DD__reason_for_change
  VERSION: '2018-09-03__reformat_from_old_structure',

  DECK_LIST_TYPES: [
    'mainDeck',
    'commandZone',
    'sideboard'
  ],
  CARD_TYPES_BY_PRIORITY: [
    'land',
    'creature',
    'artifact',
    'enchantment',
    'planeswalker',
    'instant',
    'sorcery',
    'tribal',
    'conspiracy',
    'phenomenon',
    'plane',
    'scheme',
    'vanguard'
  ],
  CARD_TYPES_WITH_NONSTANDARD_PLURALS: {
    sorcery: 'sorceries',
    conspiracy: 'conspiracies',
    phenomenon: 'phenomena'
  },
  MISSING_CARD_IMAGE: 'https://img.scryfall.com/errors/missing.jpg'
}
