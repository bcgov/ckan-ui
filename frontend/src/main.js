import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import router from './router'
import InfiniteLoading from 'vue-infinite-loading';

import store from './store'


Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

//Vue.use(BootstrapVue)
Vue.use(Vuetify, {
  iconfont: 'mdi', // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
      primary: '#003366',
      secondary: '#5475a7',
      accent: '#8c9eff',
      error: '#b71c1c',
      text: "#ffffff",
      data: '#F4F4F4',
  },
  options: {
      customProperties: true
  }
})
Vue.use(InfiniteLoading, {
    system: {
        throttleLimit: 500
    }
})

Vue.use(VueI18n);

import messages from './i18n/messages'

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages, // set locale messages
})


new Vue({
    render: h => h(App),
    router,
    store,
    i18n,
}).$mount('#app')
