const Vue = require('vue')
const VueRouter = require('vue-router')

const App = require('./App.vue')

Vue.use(VueRouter)

const DeckBuilder = require('./pages/deck-builder.vue')

const routes = [
  { path: '/', redirect: '/deck-builder' },
  { path: '/deck-builder', component: DeckBuilder }
]

const router = new VueRouter({
  linkActiveClass: 'is-active',
  mode: 'history',
  routes // short for `routes: routes`
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
