const Vue = require('vue')

const App = require('./App.vue')

const router = require('./router')
const store = require('./store')

new Vue({ // eslint-disable-line no-new
  el: '#app',
  router,
  store,
  render: h => h(App)
})
