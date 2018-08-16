module.exports = function constructComputedMethodsForDeck (methods) {
  return methods.reduce((accum, key) => {
    accum[key] = {
      set (val) {
        this.$store.commit('updateDeck', {
          [key]: val
        })
      },
      get () {
        return this.$store.state.deck[key]
      }
    }

    return accum
  }, {})
}
