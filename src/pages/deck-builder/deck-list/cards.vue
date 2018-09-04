<template>
  <div :data-cy="type + '-list'" v-if="deckView === type">
    <table class="table is-fullwidth">
      <tbody>
        <card-input
          v-for="card in cards" :key="`card-${card.id}`"
          :card="card"
          :type="type"
          v-show="shouldShow(card)"
        ></card-input>
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
const formatTag = require('../../../lib/format-tag')

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
    return {}
  },
  computed: Object.assign(
    mapState([
      'deck',
      'deckView',
      'activeDeckTags'
    ]),
    {
      cards () {
        const list = this.deck[this.type]

        return Object.keys(list).reduce((cards, cardId) => {
          cards.push(list[cardId])
          return cards
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
      }
    }
  )
}
</script>

<style scoped>
.tag {
  cursor: pointer;
}
</style>
