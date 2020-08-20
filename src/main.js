import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import i18n from './i18n'

Vue.use(VueLodash, { lodash: lodash })
Vue.config.productionTip = false
Vue.prototype.axios = axios;


new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
