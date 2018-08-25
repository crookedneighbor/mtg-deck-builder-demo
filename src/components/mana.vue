<template>
  <div class="mana-symbols">
    <img
      v-for="(symbol, index) in manaSymbols" :key="`mana-${index}`"
      :src="symbol"
    />
  </div>
</template>

<script>
const ScryfallClient = require('scryfall-client')

export default {
  props: ['symbols'],
  computed: {
    manaSymbols () {
      if (!this.symbols) {
        return []
      }

      let symbols = this.symbols.substring(1, this.symbols.length - 1).split('}{')

      if (symbols) {
        return symbols.map((symbol) => {
          return ScryfallClient.symbols[symbol]
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
