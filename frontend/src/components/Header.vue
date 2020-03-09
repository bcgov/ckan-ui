<template>
  <span>
    <div class="headerSpacer"></div>
    <header class="gov-header gov-yellow-border-bottom">
      <v-toolbar color="primary" flat dense fixed class="px-md-10">
        <!-- Navbar content -->
        <a id="header-gov-logo" href="https://www2.gov.bc.ca">
            <img
                src="@/assets/images/17_gov3_bc_logo.svg"
                width="auto" height="30"
                alt="B.C. Government Logo">
        </a>
        <v-toolbar-title><v-btn id="header-home" class="title hidden-sm-and-down font-weight-black" color="text" text to="/">{{$tc("DataCatalogue")}}</v-btn></v-toolbar-title>
        <v-spacer></v-spacer>


          <!--<v-btn text id="nav-old" v-if="classicUrl" class="navbar-link lvl2-link hidden-sm-and-down" :href="classicUrl">{{$tc('Classic')}}</v-btn>-->

          <!-- <User v-if="loggedIn" :user="user"></User>
          <v-btn text id="nav-login" v-else class="navbar-link lvl2-link hidden-sm-and-down" :href="logInUrl" @click="clearStorage"> {{$tc("LogIn")}}</v-btn>

          <v-menu offset-y bottom color="primary">
            <template v-slot:activator="{ on }">
              <v-btn text v-on="on" id="header-language">
                {{$tc("Language")}}
              </v-btn>
            </template>
            <v-row align-center justify-center fill-height class="secondary_color">
                <v-col cols=12>
                    <v-list dense class="header-menu-secondary">
                      <v-list-item id="header-language-en" @click="setLanguage('en')">English</v-list-item>
                      <v-list-item id="header-language-fr" @click="setLanguage('fr')">Français</v-list-item>
                    </v-list>
                </v-col>
            </v-row>
          </v-menu> -->

          <v-btn v-if="!loggedIn" depressed text large id="login-btn" class="hidden-sm-and-down" :href="logInUrl" @click="clearStorage" height="100%">{{$tc("LogIn")}}</v-btn>
          <v-btn v-else depressed text large id="logout-btn" class="hidden-sm-and-down" @click="logout" height="100%"><v-icon left>mdi-account</v-icon> {{$tc('Logout')}}</v-btn>
          <v-btn v-if="showCreate" depressed text large id="add-dataset" class="hidden-sm-and-down" :to="{name: 'dataset_create'}" height="100%">{{$tc('Add Dataset')}}</v-btn>
          <v-btn v-if="this.$i18n.locale != 'en'" depressed text large id="english-btn" class="hidden-sm-and-down" @click="setLanguage('en')" height="100%">English</v-btn>
          <v-btn v-if="this.$i18n.locale != 'fr'" depressed text large id="french-btn" class="hidden-sm-and-down" @click="setLanguage('fr')" height="100%">Français</v-btn>

          <v-btn depressed tile large @click="searchClick" id="header-search" color="#e3a82b" height="100%">
            <v-icon large>mdi-magnify</v-icon>
          </v-btn>


          <v-menu bottom left offset-y color="secondary" transition="slide-y-transition">
            <template v-slot:activator="{ on }">
              <v-btn depressed tile large @click="showSearch = false" v-on="on" id="header-menu" color="secondary" height="100%">
                <v-icon large>mdi-menu</v-icon>
              </v-btn>
            </template>
            <!-- <v-row justify-left fill-height class="secondary_color">
                <v-col cols=12 class="gov-yellow-border-top"> -->
                    <v-list dense class="header-menu not-rounded gov-yellow-border-bottom">
                      <v-list-item v-if="!loggedIn" color="text" id="mobile-login-btn" class="hidden-md-and-up" :href="logInUrl" @click="clearStorage">{{$tc("LogIn")}}</v-list-item>
                      <v-list-item v-else color="text" id="mobile-logout-btn" class="hidden-md-and-up" :href="logInUrl" @click="logout">{{$tc("Logout")}}<v-icon right>mdi-account</v-icon></v-list-item>
                      <v-list-item v-if="showCreate" color="text" id="mobile-add-dataset-btn" class="hidden-md-and-up" :to="{name: 'dataset_create'}">{{$tc("Add Dataset")}}</v-list-item>
                      <template v-for="(item, key) in menuTertiary">
                          <v-list-item v-if="item.link" color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'secondary-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                          <v-list-item v-else-if="item.title !== ''" color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'secondary-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                      </template>
                    </v-list>
                <!-- </v-col>
                <v-col cols=12 class="primary_color gov-yellow-border-top"> -->
                    <v-list dense class="header-menu-secondary not-rounded gov-yellow-border-bottom">
                      <template v-for="(item, key) in menuSecondary">
                          <v-list-item v-if="item.link" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'tertiarry-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                          <v-list-item v-else-if="item.title !== ''" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'tertiarry-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                      </template>
                      <v-list-item v-if="this.$i18n.locale != 'en'" left fixed color="text" id="mobile-english-btn" class="hidden-md-and-up" @click="setLanguage('en')">English</v-list-item>
                      <v-list-item v-if="this.$i18n.locale != 'fr'" left fixed color="text" id="mobile-french-btn" class="hidden-md-and-up" @click="setLanguage('fr')">Français</v-list-item>
                    </v-list>
                <!-- </v-col>
            </v-row> -->
          </v-menu>

      </v-toolbar>
      <v-container class="searchBar gov-yellow-border-bottom gov-yellow-border-top" v-show="showSearch" py-0 px-12>
        <v-row wrap>
          <v-col class="py-0">
            <v-text-field ref="headerSearch" id="header-search" :label="$tc('SearchDatasets')" v-model="searchText" outline v-on:keyup="search"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </header>
  </span>
</template>

<script>
import { mapState } from 'vuex'

import {CkanApi} from '../services/ckanApi'
const ckanServ = new CkanApi()

// import User from './user/user'

export default {
  components: {
    //   User: User
  },
  props: [],
  data () {
    let locale = (window.navigator.userLanguage || window.navigator.language).substring(0,2);
    return {
        searchText: this.$store.state.search.searchText ? this.$store.state.search.searchText : "",
        logInUrl: "/api/login?r="+this.$router.history.current.fullPath,
        logoutUrl: "/api/logout?r="+window.location.pathname,
        showSearch: false,
        loadedLanguages: locale === "fr" ? ['fr', 'en'] : ['en'],
        classicUrl: '',
        menuSecondary: [
            {
                "title": "What is DataBC?",
                "href": "http://www2.gov.bc.ca/gov/content/governments/about-the-bc-government/databc"
            },
            // {
            //     "title": "Dataset Usage",
            //     "link": "/usage"
            // },
            {
                "title": "Geographic Services",
                "href": "https://www2.gov.bc.ca/gov/content/data/geographic-data-services"
            },
            {
                "title": "Blog",
                "href": "https://engage.gov.bc.ca/data/"
            },
            {
                "title": "Developers",
                "href": "https://www.bcdevexchange.org/"
            },
            {
                "title": "Contact",
                "href": "https://forms.gov.bc.ca/databc-contact-us/"
            },
            {
              title: "",
            }
        ]
    }
  },
  watch: {
    $route(to){
      this.logInUrl = "/api/login?r="+to.fullPath;
      this.$store.dispatch('user/getCurrentUser')
    },
  },
  computed: {
    ...mapState({
      user: state => state.user.authUser,
      loggedIn: state => state.user.loggedIn,
      sysAdmin: state => state.user.sysAdmin,
      isAdmin: state => state.user.isAdmin,
      isEditor: state => state.user.isEditor,
      userLoading: state => state.user.userLoading,
    }),

    showCreate: function(){
        // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
        //return ( ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

        return ( (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.isEditor)) );
    },

    menuTertiary() {
        return [
            {
                "title": "Datasets",
                "link": "/datasets"
            },
            {
                "title": "Organizations",
                "link": "/organization"
            },
            {
                "title": "Groups",
               "link": "/groups"
            },
            {
                "icon": "mdi-rss",
                "title": "Subscribe to new data",
                "href": this.classicUrl + '/feeds/recent.rss'
            },
            {
                "icon": "mdi-rss",
                "title": "Subscribe to Blog Posts",
                "href": "https://engage.gov.bc.ca/data/feed/"
            },
            {
                "title": "About",
                "link": "/about"
            },
        ]
    }
  },
  methods:{
      search: function(e){
          if (e.keyCode === 13) {
            this.showSearch = false;
            this.$store.commit('search/setSearchText', this.searchText);
            if (this.$route.path !== '/datasets'){
              this.$router.push('/datasets');
            }

          }
      },
      searchClick: function(){
          this.showSearch = !this.showSearch
          this.$nextTick(() => {
            this.$refs.headerSearch.focus();
          })
      },

      setLanguage: function(local){
        if (!this.loadedLanguages.includes(local)){
          var self = this;
          import(/* webpackChunkName: "lang-[request]" */ `@/i18n/${local}.js`).then( (messages) => {
            //eslint-disable-next-line
            console.log("M", messages.default);
            self.$i18n.setLocaleMessage(local, messages.default.fr)
            self.loadedLanguages.push(local);
            this.$i18n.locale = local;
            document.querySelector('html').setAttribute('lang', local);
          })
        }else{
          this.$i18n.locale = local;
          document.querySelector('html').setAttribute('lang', local);
        }
      },

      clearStorage: function(){
        var keys = Object.keys(localStorage);
        for (var i=0; i<keys.length; i++){
          delete localStorage[keys[i]];
        }
      },
      logout: function(){
        var keys = Object.keys(localStorage);
        for (var i=0; i<keys.length; i++){
            delete localStorage[keys[i]];
        }
        window.location.href = this.logoutUrl
      }
  },
  mounted: function(){
    this.$store.dispatch('user/getCurrentUser')

    let self = this;
    this.$store.subscribe((mutation) => {
        if (mutation.type === 'search/setSearchText'){
            self.searchText = this.$store.state.search.searchText;
        }

    });

    if (localStorage.classicUrl){
        this.classicUrl = localStorage.classicUrl;
    }else {
        ckanServ.getClassic().then((data) => {
            if (data.url) {
                localStorage.classicUrl = data.url;
                this.classicUrl = data.url;
            }
        });
    }
  },
}
</script>

<style scoped>

  .headerSpacer{
    top: 0px;
    height: 48px;
  }

</style>

<style>

  .gov-header{
    position: fixed;
    width: 100%;
    top: 0px;
    z-index: 100;
  }

  .searchBar{
    position: absolute;
    background: white;
    width: 100%;
    max-width: none !important;
  }

  div .v-list__tile {
    padding: 0px;
  }

  .v-btn {
    margin:auto;
  }
   .v-btn--active.title:before, .v-btn.title:focus:before, .v-btn.title:hover:before {
    background: none !important;
  }

   .theme--light.v-list.header-menu {
       background-color: var(--v-secondary-base);
   }

   .theme--light.v-list.header-menu-secondary{
       background-color: var(--v-primary-base);
   }

   .header-menu .theme--light.v-btn{
      color: var(--v-text-base);
   }

   .navbar-link.theme--light.v-btn{
     color: var(--v-text-base);
   }

   .header-menu .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled){
     color: var(--v-text-base) !important;
   }

   .header-menu-secondary .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled){
     color: var(--v-text-base) !important;
   }

   .secondary_color{
       background-color: var(--v-secondary-base);
   }

   .primary_color{
     background-color: var(--v-primary-base);
   }

   .v-toolbar__content .theme--light.v-btn{
     color: var(--v-text-base);
   }

   .v-toolbar__content .v-btn__content{
     color: var(--v-text-base);
   }

   .gov-yellow-border-bottom{
       border-bottom-color: #e3a82b !important;
       border-bottom-width: 2px !important;
       border-bottom-style: solid !important;
   }

   .gov-yellow-border-top{
       border-top-color: #e3a82b !important;
       border-top-width: 2px !important;
       border-top-style: solid !important;
   }

   .not-rounded{
       border-radius: 0px !important;
   }


</style>
