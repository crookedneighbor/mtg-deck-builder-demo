<template>
  <div :data-cy="type + '-list'" v-if="deckView === type">
    <button class="button" @click="focusOnAddNew">Add New</button>
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
        <new-card :id="newCardId" :type="type"></new-card>
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

const CardInput = require('./card-input.vue')
const NewCard = require('./new-card.vue')

const {mapMutations, mapState} = require('vuex')

export default {
  props: ['type'],
  components: {
    'card-input': CardInput,
    'new-card': NewCard
  },
  data () {
    return {
      primaryOrganizationChoice: 'card-type',
      primaryOrganizationalChoices: {
        'card-type': {
          key: 'card-type',
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
        'converted-mana-cost': {
          key: 'converted-mana-cost',
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
        }
      },
      secondaryOrganizationalChoices: {
        'name': {
          key: 'name',
          sort (card1, card2) {
            const name1 = card1.name.toUpperCase()
            const name2 = card2.name.toUpperCase()

            if (name1 > name2) {
              return 1
            }
            if (name1 < name2) {
              return -1
            }
            return 0
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
        return `${this.type}-new-card-input`
      },
      cards () {
        const list = this.deck[this.type]

        return Object.keys(list).reduce((cards, cardId) => {
          cards.push(list[cardId])
          return cards
        }, [])
      },
      collectionOfCards () {
        let choice = this.primaryOrganizationalChoices[this.primaryOrganizationChoice]
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
            }).sort(this.secondaryOrganizationalChoices.name.sort)
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
        document.querySelector(`#${this.newCardId} input`).focus()
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
