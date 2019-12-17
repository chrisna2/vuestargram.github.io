import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store.js'
import './registerServiceWorker'
import { firestorePlugin } from 'vuefire'

Vue.config.productionTip = false
Vue.use(firestorePlugin);

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
