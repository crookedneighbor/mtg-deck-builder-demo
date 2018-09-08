<template>
  <div :data-cy="type + '-list'" v-if="deckView === type">
    <div  v-if="cardsInDeckList.length > 0">
      <button data-cy="focus-add-new-button" class="button" @click="focusOnAddNew">Add New Card</button>

      <hr>

      <div class="columns">
        <div class="column">
          <label class="label">Group By</label>
          <div class="select">
            <select data-cy="group-by-choice" v-model="groupByChoice">
              <option
                v-for="choice in groupByChoices" :key="`group-choice-option-${choice.key}`"
                :value="choice.key">
                {{choice.label}}
              </option>
            </select>
          </div>
        </div>
        <div class="column">
          <label class="label">Order Group By</label>
          <div class="select">
            <select data-cy="sort-by-choice" v-model="sortByChoice">
              <option
                v-for="choice in sortByChoices" :key="`sort-choice-option-${choice.key}`"
                :value="choice.key">
                {{choice.label}}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <table
      v-for="collection in collectionOfCards" :key="collection.key"
      :data-cy="type + '-' + collection.key"
      class="table is-fullwidth"
    >
      <tbody>
        <tr>
          <th>{{collection.name}}</th>
          <th class="section-quantity">{{collection.quantity}}</th>
        </tr>
        <card-input
          v-for="card in collection.cards" :key="`card-${card.id}`"
          :card="card"
          :type="type"
          v-show="shouldShow(card)"
        ></card-input>
      </tbody>
    </table>

    <table
      :id="type + '-clean-up'"
      :data-cy="type + '-clean-up'"
      class="table is-fullwidth"
      v-if="getCardsThatNeedCleanup().length > 0"
    >
      <tbody>
        <tr>
          <th>Unorganized Cards</th>
          <th class="has-text-right"><span class="tag" @click="cleanUp">Clean up</span></th>
        </tr>
        <card-input
          v-for="card in getCardsThatNeedCleanup()" :key="`cleanup-card-${card.id}`"
          :card="card"
          :type="type"
          v-show="shouldShow(card)"
        ></card-input>
      </tbody>
    </table>
    <table class="table is-fullwidth">
      <tbody>
        <new-card :type="type"></new-card>
      </tbody>
    </table>

    <div v-if="cardListTags.length > 0">
      <h3 class="subtitle">Filter Cards by Tags</h3>

      <div class="tags">
        <span
          v-for="tag in cardListTags" :key="`tag-name-${tag}`"
          class="tag"
          :class="{'is-info': activeDeckTags[tag]}"
          @click="setTagActiveState({tag})"
        >{{formatTag(tag)}}</span>
        <span class="tag is-warning" v-if="anyTagActive" @click="clearActiveTags">Clear Tags</span>
      </div>
    </div>

  </div>
</template>

<script>
const constants = require('../../../lib/constants')
const formatTag = require('../../../lib/format-tag')
const capitalize = require('../../../lib/capitalize')
const CARD_TYPES_BY_PRIORITY = constants.CARD_TYPES_BY_PRIORITY
const CARD_TYPES_WITH_NONSTANDARD_PLURALS = constants.CARD_TYPES_WITH_NONSTANDARD_PLURALS
const COLORS = constants.COLORS
const TWO_COLOR_GUILDS = constants.TWO_COLOR_GUILDS
const THREE_COLOR_GROUPS = constants.THREE_COLOR_GROUPS
const FOUR_COLOR_GROUPS = constants.FOUR_COLOR_GROUPS
const FIVE_COLOR = constants.FIVE_COLOR

const CardInput = require('./card-input.vue')
const NewCard = require('./new-card.vue')

const {mapMutations, mapState} = require('vuex')

function sortByProperty (first, second, property) {
  let prop1 = first[property]
  let prop2 = second[property]

  if (typeof prop1 === 'string' && typeof prop2 === 'string') {
    prop1 = prop1.toLowerCase()
    prop2 = prop2.toLowerCase()
  }

  if (prop1 > prop2) {
    return 1
  }
  if (prop1 < prop2) {
    return -1
  }
  return 0
}

export default {
  props: ['type'],
  components: {
    'card-input': CardInput,
    'new-card': NewCard
  },
  data () {
    return {
      groupByChoice: 'card-type',
      groupByChoices: {
        'card-type': {
          key: 'card-type',
          label: 'Card Type',
          duplicates: false,
          sections: CARD_TYPES_BY_PRIORITY.map((type) => {
            return {
              key: type,
              heading: capitalize(CARD_TYPES_WITH_NONSTANDARD_PLURALS[type] ? CARD_TYPES_WITH_NONSTANDARD_PLURALS[type] : `${type}s`),
              include (card) {
                return card.typeLine && card.typeLine.toLowerCase().indexOf(type) > -1
              }
            }
          })
        },
        'color': {
          key: 'color',
          label: 'Color',
          duplicates: false,
          sections: [
            ...COLORS.map((color) => {
              let colorInitial = color.key

              return {
                key: `color-${colorInitial}`,
                heading: color.name,
                include (card) {
                  let colors = card.colors

                  return colors.length === 1 && colors[0] === colorInitial
                }
              }
            }),
            {
              key: 'color-gold',
              heading: 'Multicolored',
              include (card) {
                let colors = card.colors

                return colors.length > 1
              }
            },
            {
              key: 'color-colorless',
              heading: 'Colorless',
              include (card) {
                let colors = card.colors

                return colors.length === 0
              }
            }]
        },
        'color-identity': {
          key: 'color-identity',
          label: 'Color Identity',
          duplicates: false,
          sections: [
            ...COLORS.map((color) => {
              let colorInitial = color.key

              return {
                key: `color-identity-${colorInitial}`,
                heading: color.name,
                include (card) {
                  let colors = card.colorIdentity

                  return colors.length === 1 && colors[0] === colorInitial
                }
              }
            }),
            ...[
              ...TWO_COLOR_GUILDS,
              ...THREE_COLOR_GROUPS,
              ...FOUR_COLOR_GROUPS,
              FIVE_COLOR
            ].map((config) => {
              return {
                key: `color-identity-${config.key}`,
                heading: config.name,
                include (card) {
                  const sameLength = config.colors.length === card.colorIdentity.length

                  if (!sameLength) {
                    return false
                  }

                  return config.colors.reduce((isIdentical, color) => {
                    if (!isIdentical) {
                      return false
                    }

                    return Boolean(card.colorIdentity.find(colorToFind => color === colorToFind))
                  }, true)
                }
              }
            }), {
              key: 'color-identity-colorless',
              heading: 'Colorless',
              include (card) {
                return card.colorIdentity.length === 0
              }
            }
          ]
        },
        'converted-mana-cost': {
          key: 'converted-mana-cost',
          label: 'Converted Cost',
          duplicates: false,
          sections: [...Array(20).keys()].map((cost) => {
            return {
              key: `cmc-${cost}`,
              heading: `${cost} CMC`,
              include (card) {
                let cmc = Number(String(card.cmc).split('.')[0])

                return cmc === cost
              }
            }
          })
        },
        'no-grouping': {
          key: 'no-grouping',
          label: 'No Grouping',
          duplicates: false,
          sections: [{
            key: 'no-grouping',
            heading: 'Cards',
            include (card) {
              return card
            }
          }]
        }
      },
      sortByChoice: 'name',
      sortByChoices: {
        name: {
          key: 'name',
          label: 'Name',
          sort (card1, card2) {
            return sortByProperty(card1, card2, 'name')
          }
        },
        'converted-mana-cost': {
          key: 'converted-mana-cost',
          label: 'Converted Cost',
          sort (card1, card2) {
            let result = sortByProperty(card1, card2, 'cmc')

            if (result !== 0) {
              return result
            }

            return sortByProperty(card1, card2, 'name')
          }
        }
      }
    }
  },
  computed: Object.assign(
    mapState([
      'deck',
      'deckView',
      'activeDeckTags'
    ]),
    {
      newCardId () {
        return `${this.type}-new-card`
      },
      cards () {
        const list = this.deck[this.type]

        return Object.keys(list).reduce((cards, cardId) => {
          cards.push(list[cardId])
          return cards
        }, [])
      },
      cardsInDeckList () {
        return this.cards.filter(card => !card.needsCleanup)
      },
      collectionOfCards () {
        let choice = this.groupByChoices[this.groupByChoice]
        let sortByChoice = this.sortByChoices[this.sortByChoice]

        let allowDuplicates = choice.duplicates
        let cardsInCollection = {}

        return choice.sections.reduce((collection, sectionDetails) => {
          let section = {
            name: sectionDetails.heading,
            key: sectionDetails.key,
            cards: this.cards.filter((card) => {
              if (card.needsCleanup) {
                return false
              }

              if (!allowDuplicates && cardsInCollection[card.id]) {
                return false
              }

              const shouldInclude = sectionDetails.include(card)

              if (shouldInclude) {
                cardsInCollection[card.id] = true
              }

              return shouldInclude
            }).sort(sortByChoice.sort)
          }

          section.quantity = section.cards.reduce((amount, card) => {
            amount = amount + card.quantity

            return amount
          }, 0)

          if (section.cards.length > 0) {
            collection.push(section)
          }

          return collection
        }, [])
      },
      anyTagActive () {
        for (let tag in this.activeDeckTags) {
          if (this.cardListTags.indexOf(tag) === -1) {
            delete this.activeDeckTags[tag]
          } else if (this.activeDeckTags[tag]) {
            return true
          }
        }

        return false
      },
      cardListTags () {
        let tags = new Set()

        this.cards.forEach((card) => {
          card.tags.forEach(tag => tags.add(tag))
        })

        return Array.from(tags)
      }
    }
  ),
  methods: Object.assign(
    mapMutations(['setTagActiveState']),
    {
      getCardsThatNeedCleanup () {
        return this.cards.filter(card => card.needsCleanup)
      },
      cleanUp () {
        this.getCardsThatNeedCleanup().forEach((card) => {
          let cardThatAlreadyExists = this.cards
            .filter(card => !card.needsCleanup)
            .find(organizedCard => organizedCard.name === card.name)

          if (!cardThatAlreadyExists) {
            card.needsCleanup = false
            return
          }

          cardThatAlreadyExists.quantity += card.quantity
          this.deck.removeCard(this.type, card)
        })

        this.deck.saveDeck()

        this.$forceUpdate()
      },
      clearActiveTags () {
        for (let tag in this.activeDeckTags) {
          this.setTagActiveState({
            tag,
            value: false
          })
        }
      },
      shouldShow (card) {
        if (!this.anyTagActive) {
          return true
        }

        return Boolean(card.tags.find(tag => this.activeDeckTags[tag]))
      },
      formatTag (tag) {
        return formatTag(tag)
      },
      focusOnAddNew () {
        document.querySelector(`#${this.newCardId}`).focus()
      }
    }
  )
}
</script>

<style scoped>
.tag {
  cursor: pointer;
}

.section-quantity {
  text-align: right;
}
</style>
