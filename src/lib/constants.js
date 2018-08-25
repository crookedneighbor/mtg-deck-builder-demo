module.exports = {
  // version to check when deciding if deck should be re-imported
  // from scryfall. This should be changed whenever there's a new
  // field added to the stored decks. For organizational puproses,
  // the naming convention is YYYY-MM-DD__reason_for_change
  VERSION: '2018-08-23__add_unique_id_to_cards',

  DECK_LIST_TYPES: [
    'mainDeck',
    'commandZone',
    'sideboard'
  ],
  MISSING_CARD_IMAGE: 'https://img.scryfall.com/errors/missing.jpg'
}
