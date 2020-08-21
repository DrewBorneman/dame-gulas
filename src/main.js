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
  { path: '/', 
    component: Home,
    meta: {
      title: 'Dáme Guláš',
      metaTags: [
        {
          name: 'description',
          content: 'Dáme Guláš - Find the guláš offering nearest to you with the click of a button.'
        },
        {
          property: 'og:description',
          content: 'Dáme Guláš - Find the guláš offering nearest to you with the click of a button.'
        }
      ],
    },
  },
  { path: '/about',
    component: About,
    meta: {
      title: 'About - Dáme Guláš',
      metaTags: [
        {
          name: 'description',
          content: 'Dáme Guláš - Find the guláš offering nearest to you with the click of a button.'
        },
        {
          property: 'og:description',
          content: 'Dáme Guláš - Find the guláš offering nearest to you with the click of a button.'
        }
      ],
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
