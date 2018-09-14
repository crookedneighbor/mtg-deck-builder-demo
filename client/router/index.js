const Vue = require('vue')
const VueRouter = require('vue-router')

Vue.use(VueRouter)

const DeckBuilder = require('../pages/deck-builder/index.vue')

const routes = [
  { path: '/', component: DeckBuilder },
  // hack for github pages
  { path: '/mtg-deck-builder-demo/', component: DeckBuilder }
]

const router = new VueRouter({
  linkActiveClass: 'is-active',
  mode: 'history',
  routes // short for `routes: routes`
})

module.exports = router
