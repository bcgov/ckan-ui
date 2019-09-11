import Vue from 'vue';
import App from './App.vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import Vuetify from 'vuetify';
import VueI18n from 'vue-i18n';
import VueAnalytics from 'vue-analytics';
import 'es6-promise/auto';
import 'vuetify/dist/vuetify.min.css';
import lineClamp from 'vue-line-clamp';
import Clipboard from 'v-clipboard';

import router from './router';
import InfiniteLoading from 'vue-infinite-loading';

import store from './store';

import {Analytics} from './services/analytics';

import { ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email } from 'vee-validate/dist/rules';


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

Vue.use(Clipboard);

// Vue.use(VeeValidate, {});
Vue.component('ValidationProvider', ValidationProvider);
extend('required', {
  ...required,
  message: (field) => { return field[0].toUpperCase() + field.slice(1) + ' is required.'; }
});

extend('email', {
  ...email,
  message: (field) => { return field[0].toUpperCase() + field.slice(1) + ' is not a valid email.'; }
});

extend('url', {
  params: ['require_tld', 'require_host'],
  validate: (value, { require_tld, require_host }) => { 
    if (value || require_tld || require_host){
      return true;
    }
    return  true;
  },
  message: (field) => { return field[0].toUpperCase() + field.slice(1) + ' is not a valid url'; }
});

extend('date_format', {
  params: ['format'],
  validate: (value, { format }) => {
    var regString = '';
    let month = '';
    let day = '';
    let year = '';
    if (!format){
      return true;
    }

    if (value.length !== format.length){
      return false;
    }

    for (var i=0; i<format.length; i++){
      if (format[i].toLowerCase() === 'y'){
        year += value[i];
        regString += '[0-9]';
      }else if (format[i].toLowerCase() === 'm'){
        month += value[i];
        regString += '[0-9]';
      }else if (format[i].toLowerCase() === 'd'){
        day += value[i];
        regString += '[0-9]';
      }else{
        regString += format[i];
      }
    }
    var regexp = new RegExp(regString);
    //doesn't match
    if (!value.match(regexp)){
      return false;
    }

    month = parseInt(month);
    day = parseInt(day);
    year = parseInt(year);

    //not valid month
    if (month <= 0 || month > 12){
      return false;
    }

    let daysInMonth = new Date(year, month, 0).getDate();

    if (day < 0 || day > daysInMonth){
      return false;
    }
    
    return  true;
  },
  message: (field, {format} ) => { return field[0].toUpperCase() + field.slice(1) + ' is not a valid date please enter as ' + format; }
});

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
    });
  }


  new Vue({
      render: h => h(App),
      router,
      store,
      i18n,
  }).$mount('#app');
});