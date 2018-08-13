const Vue = require('vue')

const App = require('./App.vue')

const router = require('./router')

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
