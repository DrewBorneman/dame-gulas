import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueLodash from 'vue-lodash'
import VueRouter from 'vue-router'
import lodash from 'lodash'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import i18n from './i18n'

import Home from './components/Home.vue'
import About from './components/About.vue'

Vue.use(VueLodash, { lodash: lodash })
Vue.use(VueRouter);
Vue.config.productionTip = false
Vue.prototype.axios = axios;

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
