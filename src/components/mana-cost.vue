<template>
  <div class="mana-cost">
    <img v-for="symbol in manaSymbols" :src="symbol"/>
  </div>
</template>

<script>
const ScryfallClient = require('scryfall-client')

export default {
  props: ['manaCost'],
  computed: {
    manaSymbols() {
      let symbols = this.manaCost.match(/{(.)(\/(.))?}/g)

      if (symbols) {
        return symbols.map((symbol) => {
          return ScryfallClient.symbols[symbol.slice(1, -1)]
        })
      } 

      return []
    }
  }
}
</script>

<style scoped>
.mana-cost {
  text-align: right;
}
.mana-cost img {
  height: 20px;
  margin: 0 2px;
}
</style>
