<template>
  <div class="mana-symbols">
    <img v-for="symbol in manaSymbols" :src="symbol"/>
  </div>
</template>

<script>
const ScryfallClient = require('scryfall-client')

export default {
  props: ['symbols'],
  computed: {
    manaSymbols() {
      let symbols = this.symbols.match(/{(.)(\/(.))?}/g)

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
.mana-symbols img {
  height: 20px;
  margin: 0 2px;
}
</style>
