import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import '@/assets/css/bootstrap-theme.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import InfiniteLoading from 'vue-infinite-loading';

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(InfiniteLoading, {
    system: {
        throttleLimit: 500
    }
})

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')
