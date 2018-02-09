require('./main.css')
const router = require('./routes')
const Vue = require('vue')
const VueMaterial = require('vue-material')
const VueRouter = require('vue-router')

Vue.use(VueMaterial)
Vue.use(VueRouter)

new Vue({
  el: '#app',
  router: new VueRouter(router),
  render: r => r(require('./components/app.vue'))
})
