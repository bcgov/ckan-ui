import Vue from 'vue';
import App from './App.vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';
import Vuetify from 'vuetify/lib';
import VueI18n from 'vue-i18n';
import VueGtag from 'vue-gtag';
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
Vue.use(Vuetify);

Vue.use(InfiniteLoading, {
    system: {
        throttleLimit: 500
    }
});

Vue.use(VueI18n);

Vue.use(lineClamp, {});

Vue.use(Clipboard);

var VueScrollTo = require('vue-scrollto');
 
Vue.use(VueScrollTo);

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

extend('slug', {
  validate: (value) => {
    if (value){
      var regString = '^[A-z0-9-_]*$';
      let regex = new RegExp(regString);
      return value.match(regex);
    }
    return  true;
  },
  message: (field) => { return field[0].toUpperCase() + field.slice(1) + ' is not a valid slug you can only use letters, numbers dashes and/or underscores'; }
});

extend('url', {
  params: ['require_tld', 'require_host'],
  validate: (value, { require_tld, require_host }) => {
    if (value){
      var regString = '^';
      if (require_tld){
        regString += '(ht|f)tp(s)?://';
      }
      if (require_host){
        regString += '[A-z0-9-_]+[.][A-z0-9-_][A-z0-9-_.]*';
      }
      regString += '[A-z0-9?&=.,/\\-_#!]*$';

      let regex = new RegExp(regString);
      return value.match(regex);
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

var locale = (window.navigator.userLanguage || window.navigator.language).substring(0,2);
var messages = require('./i18n/en').default;
if (locale == "fr"){
  Object.assign(messages, require('./i18n/fr').default);
}

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages, // set locale messages
  silentFallbackWarn: process.env.NODE_ENV === "production"
});

router.beforeEach((to, from, next) => {
  // some components assume the responsibiity for setting the page title.
  // they're identified by the dynamicTitle router meta
  if (!to.meta.dynamicTitle) {
    document.title = i18n.tc(to.meta.title);
  }
  next();
});

analyticsServ.ga().then( (gajson) => {

  if (gajson.id){
    Vue.use(VueGtag, {
      config: {
        id: gajson.id,
        params: {
          anonymize_ip: true
        }
      }
    }, router);
  }


  let vuetifyOpts = {
    icons: {
      iconfont: 'mdi' || 'md' // || 'mdi' || 'fa' || 'fa4'
    },
    theme: {
        dark: false,
        options: {
          customProperties: true
        },
        themes:{
          dark: {
            primary: '#003366',
            secondary: '#5475a7',
            tertiary: '#0050a1',
            highlight: '#a5d8ff',
            accent: '#8c9eff',
            caution: "#fcba19",
            error: '#b71c1c',
            text: "#ffffff",
            text_background: "#000000",
            data: '#F4F4F4',
            govYellow: "#FCBA19",
            label_text: '#333333',
            sub_label_text: "#777777",
            menu_secondary: "#38598A",
            data_background: "#F2F2F2",
            icon: "#CCCCCC",
            faded_text: "#494949",
            filter_colour: "#38598A",
            label_colour: "#1A5A96",
            label_border: "#DDDDDD",
            error_text: "#D8292F",
            home_label: "#888888",
            banner_error: "#F2DEDE",
            banner_warning: "#F9F1C6",
            banner_info: "#D9EAF7"
          },
          light: {
            primary: '#003366',
            secondary: '#5475a7',
            tertiary: '#0050a1',
            highlight: '#a5d8ff',
            accent: '#8c9eff',
            caution: "#fcba19",
            error: '#b71c1c',
            text: "#ffffff",
            text_background: "#ffffff",
            data: '#F4F4F4',
            govYellow: "#FCBA19",
            label_text: '#333333',
            sub_label_text: "#777777",
            menu_secondary: "#38598A",
            data_background: "#F2F2F2",
            icon: "#CCCCCC",
            faded_text: "#494949",
            filter_colour: "#38598A",
            label_colour: "#1A5A96",
            label_border: "#DDDDDD",
            error_text: "#D8292F",
            home_label: "#888888",
            banner_error: "#F2DEDE",
            banner_warning: "#F9F1C6",
            banner_info: "#D9EAF7"
          }
        }
    }
  };

  new Vue({
    vuetify: new Vuetify(vuetifyOpts),
    render: h => h(App),
    router,
    store,
    i18n,
  }).$mount('#app');
});
