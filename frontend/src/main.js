import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import VueAnalytics from 'vue-analytics';
import 'es6-promise/auto';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import lineClamp from 'vue-line-clamp';

import router from './router';
import InfiniteLoading from 'vue-infinite-loading';

import store from './store';

import {Analytics} from './services/analytics';
const analyticsServ = new Analytics()

Vue.config.productionTip = false;

//Vue.use(BootstrapVue)
Vue.use(Vuetify, {
  iconfont: 'md', // 'md' || 'mdi' || 'fa' || 'fa4'
  theme: {
      primary: '#003366',
      secondary: '#5475a7',
      tertiary: '#0050a1',
      highlight: '#a5d8ff',
      accent: '#8c9eff',
      caution: "#fcba19",
      error: '#b71c1c',
      text: "#ffffff",
      data: '#F4F4F4',
  },
  options: {
      customProperties: true
  }
});
Vue.use(InfiniteLoading, {
    system: {
        throttleLimit: 500
    }
});

Vue.use(VueI18n);

Vue.use(lineClamp, {});

import messages from './i18n/messages';

var locale = (window.navigator.userLanguage || window.navigator.language).substring(0,2);


// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages, // set locale messages
  silentFallbackWarn: process.env.NODE_ENV === "production"
});

router.beforeEach((to, from, next) => {
  document.title = i18n.tc(to.meta.title);
  next();
});

analyticsServ.ga().then( (gajson) => {

  if (gajson.id){
    Vue.use(VueAnalytics, {
      id: gajson.id,
      router
    })
  }


  new Vue({
      render: h => h(App),
      router,
      store,
      i18n,
  }).$mount('#app');
});