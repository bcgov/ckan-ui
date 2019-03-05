import Vue from 'vue'
import App from './App.vue'
//import BootstrapVue from 'bootstrap-vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
//import '@/assets/css/bootstrap-theme.min.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

import router from './router'
import InfiniteLoading from 'vue-infinite-loading';

Vue.config.productionTip = false

//Vue.use(BootstrapVue)
Vue.use(Vuetify, {
  iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
})
Vue.use(Vuex)
Vue.use(InfiniteLoading, {
    system: {
        throttleLimit: 500
    }
})

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')
