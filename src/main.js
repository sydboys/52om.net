import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css'
import './assets/css/reset_element.css'

Vue.use(Element);

Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
