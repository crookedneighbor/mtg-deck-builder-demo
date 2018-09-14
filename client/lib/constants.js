module.exports = {
  // version to check when deciding if deck should be re-imported
  // from scryfall. This should be changed whenever there's a new
  // field added to the stored decks. For organizational puproses,
  // the naming convention is YYYY-MM-DD__reason_for_change
  VERSION: '2018-09-10__set_up_better_load_state',

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
  COLORS: [{
    key: 'W',
    name: 'White',
    land: 'Plains'
  }, {
    key: 'U',
    name: 'Blue',
    land: 'Island'
  }, {
    key: 'B',
    name: 'Black',
    land: 'Swamp'
  }, {
    key: 'R',
    name: 'Red',
    land: 'Mountain'
  }, {
    key: 'G',
    name: 'Green',
    land: 'Forest'
  }],
  TWO_COLOR_GUILDS: [{
    key: 'WU',
    colors: ['W', 'U'],
    name: 'Azorius'
  }, {
    key: 'UB',
    colors: ['U', 'B'],
    name: 'Dimir'
  }, {
    key: 'BR',
    colors: ['B', 'R'],
    name: 'Rakdos'
  }, {
    key: 'RG',
    colors: ['R', 'G'],
    name: 'Gruul'
  }, {
    key: 'GW',
    colors: ['G', 'W'],
    name: 'Selesnya'
  }, {
    key: 'WB',
    colors: ['W', 'B'],
    name: 'Orzhov'
  }, {
    key: 'UR',
    colors: ['U', 'R'],
    name: 'Izzet'
  }, {
    key: 'BG',
    colors: ['B', 'G'],
    name: 'Golgari'
  }, {
    key: 'RW',
    colors: ['R', 'W'],
    name: 'Boros'
  }, {
    key: 'GU',
    colors: ['G', 'U'],
    name: 'Simic'
  }],
  THREE_COLOR_GROUPS: [{
    key: 'WUB',
    colors: ['W', 'U', 'B'],
    name: 'Esper'
  }, {
    key: 'UBR',
    colors: ['U', 'B', 'R'],
    name: 'Grixis'
  }, {
    key: 'BRG',
    colors: ['B', 'R', 'G'],
    name: 'Jund'
  }, {
    key: 'RGW',
    colors: ['R', 'G', 'W'],
    name: 'Naya'
  }, {
    key: 'GWU',
    colors: ['G', 'W', 'U'],
    name: 'Bant'
  }, {
    key: 'WBG',
    colors: ['W', 'B', 'G'],
    name: 'Abzan'
  }, {
    key: 'URW',
    colors: ['U', 'R', 'W'],
    name: 'Jeskai'
  }, {
    key: 'BGU',
    colors: ['B', 'G', 'U'],
    name: 'Sultai'
  }, {
    key: 'RWB',
    colors: ['R', 'W', 'B'],
    name: 'Mardu'
  }, {
    key: 'GUR',
    colors: ['G', 'U', 'R'],
    name: 'Temur'
  }],
  FOUR_COLOR_GROUPS: [{
    key: 'WUBR',
    colors: ['W', 'U', 'B', 'R'],
    name: 'Yore-Tiller'
  }, {
    key: 'UBRG',
    colors: ['U', 'B', 'R', 'G'],
    name: 'Glint-Eye'
  }, {
    key: 'BRGW',
    colors: ['B', 'R', 'G', 'W'],
    name: 'Dune-Brood'
  }, {
    key: 'RGWU',
    colors: ['R', 'G', 'W', 'U'],
    name: 'Ink-Treader'
  }, {
    key: 'GWUB',
    colors: ['G', 'W', 'U', 'B'],
    name: 'Witch-Maw'
  }],
  FIVE_COLOR: {
    key: 'WUBRG',
    colors: ['W', 'U', 'B', 'R', 'G'],
    name: 'Five Color'
  },
  CARD_TYPES_WITH_NONSTANDARD_PLURALS: {
    sorcery: 'sorceries',
    conspiracy: 'conspiracies',
    phenomenon: 'phenomena'
  },
  MISSING_CARD_IMAGE: 'https://img.scryfall.com/errors/missing.jpg'
}
