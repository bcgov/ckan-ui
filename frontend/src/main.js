import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import '@/assets/css/bootstrap-theme.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'

Vue.config.productionTip = false

Vue.use(BootstrapVue)

new Vue({
    render: h => h(App),
    router,
}).$mount('#app')
