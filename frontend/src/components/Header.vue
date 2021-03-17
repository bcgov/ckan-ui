<template>
  <span>
    <span class="d-none d-sm-flex d-xs-flex">
      <v-dialog
        v-model="aboutDialog"
        scrollable
        :max-width="($vuetify.breakpoint.mdAndUp) ? '700px' : '100%'"
        :fullscreen="($vuetify.breakpoint.smAndDown) ? true : false"
      >
        <About @closeDialog="closeAbout" class="ml-md-5 mr-md-2 mr-0"></About>
      </v-dialog>
    </span>

    <div class="headerSpacer"></div>
    <header class="gov-header gov-yellow-border-bottom">
      <v-toolbar color="primary" flat fixed dense height="65px" class="px-md-10">
        <v-container fluid class="header-container py-0">
            <v-row class="header-row">
                <v-col cols=7 class="py-0 h-100">
                <!-- Navbar content -->
                    <a id="header-gov-logo" href="/" class="v-top">
                        <img
                            src="@/assets/images/bc_mark.png"
                            width="auto" height="100%"
                            alt="B.C. Government Logo">
                    </a>
                    <v-btn text depressed large id="header-home" class="title hidden-sm-and-down font-weight-black h-100 v-top" color="text" to="/">{{$tc("DataCatalogue")}}</v-btn>
                </v-col>
                <v-col cols=5 class="py-0 pr-0 h-100">
                    <v-menu bottom left offset-y color="secondary" transition="slide-y-transition" min-width="320px">
                        <template v-slot:activator="{ on }">
                        <v-btn depressed tile large v-on="on" @click="showSearch = false" id="header-menu" color="menu_secondary" height="100%" class="v-top float-right">
                            <v-icon large>mdi-menu</v-icon>
                        </v-btn>
                        </template>
                        <!-- <v-row justify-left fill-height class="secondary_color">
                            <v-col cols=12 class="gov-yellow-border-top"> -->
                                <v-list dense class="header-menu not-rounded gov-yellow-border-bottom">
                                <v-list-item v-if="!loggedIn" color="text" id="mobile-login-btn" class="hidden-md-and-up" :href="logInUrl" @click="clearStorage">{{$tc("LogIn")}}</v-list-item>
                                <v-list-item v-if="showCreate" color="text" id="mobile-add-dataset-btn" class="hidden-md-and-up" @click="addDataset">{{$tc("Add Dataset")}}</v-list-item>
                                <template v-for="(item, key) in menuTertiary">

                                    <span :key="'tertiary-menu-'+key" v-if="((!item.loggedIn) || (loggedIn))">
                                      <v-list-item v-if="item.link" color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'tertiary-menu-'+key" v-text="$tc(item.title, 2)">
                                        {{$tc(item.title, 2)}}
                                        <v-icon v-if="item.icon" :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                      <v-list-item v-else-if="item.title !== ''" color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'tertiary-menu-'+key">
                                        {{$tc(item.title, 2)}}
                                        <v-icon v-if="item.icon" :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                    </span>
                                </template>
                                <v-list-item v-if="loggedIn" color="text" id="mobile-logout-btn" @click="logout">{{$tc("Logout")}}</v-list-item>
                                </v-list>
                            <!-- </v-col>
                            <v-col cols=12 class="primary_color gov-yellow-border-top"> -->
                                <v-list dense class="header-menu-secondary not-rounded gov-yellow-border-bottom">
                                <template v-for="(item, key) in menuSecondary">
                                    <span v-if="item.dialog" :key="'secondary-menu-'+key">
                                      <v-list-item color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" @click.stop="aboutDialog = true">
                                        {{$tc(item.title, 2)}}
                                        <v-icon v-if="item.icon" :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                    </span>
                                    <span v-else :key="'secondary-menu-'+key">
                                      <v-list-item v-if="item.link" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'secondary-menu-'+key">
                                        {{$tc(item.title, 2)}}
                                        <v-icon v-if="item.icon" :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                      <v-list-item v-else-if="item.title !== ''" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'secondary-menu-'+key">
                                        {{$tc(item.title, 2)}}
                                        <v-icon :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                    </span>
                                </template>
                                <v-list-item v-if="this.$i18n.locale != 'en'" left fixed color="text" class="hidden-sm-and-down" id="english-btn" @click="setLanguage('en')">English</v-list-item>
                                <v-list-item v-if="this.$i18n.locale != 'fr'" left fixed color="text" class="hidden-sm-and-down" id="french-btn" @click="setLanguage('fr')">Français</v-list-item>
                                <v-list-item v-if="this.$i18n.locale != 'en'" left fixed color="text" class="hidden-md-and-up" id="mobile-english-btn" @click="setLanguage('en')">EN</v-list-item>
                                <v-list-item v-if="this.$i18n.locale != 'fr'" left fixed color="text" class="hidden-md-and-up" id="mobile-french-btn" @click="setLanguage('fr')">FR</v-list-item>
                                </v-list>
                            <!-- </v-col>
                        </v-row> -->
                    </v-menu>
                    
                    <v-btn depressed tile text large @click="showSearch=!showSearch" height="100%" class="hidden-sm-and-down v-top float-right">
                      <v-icon large>search</v-icon>
                    </v-btn>

                    <v-btn v-if="!loggedIn" depressed text large id="login-btn" class="hidden-sm-and-down header-button v-top float-right" :href="logInUrl" @click="clearStorage" height="100%">{{$tc("LogIn")}}</v-btn>
                    <v-btn v-if="showCreate" depressed text large id="add-dataset-btn" class="hidden-sm-and-down header-button v-top float-right" @click="addDataset" height="100%">{{$tc('Add Dataset')}}</v-btn>


                </v-col>
            </v-row>
            <v-row wrap v-if="showSearch" class="searchRow pb-1">
              <v-col cols=12>
                <v-text-field
                    solo
                    id="header-search"
                    class="searchbox"
                    hide-details
                    v-model="findText"
                    :label="$tc('SearchDatasets')"
                    v-on:keyup="search"
                    color="home_label"
                    :append-icon="(findText.length > 0 ) ? 'clear' : 'search'"
                    @click:clear="findText = ''"
                    @click:append="findText = ''; search({type: 'click', keycode: 13})">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row wrap v-if="showLoggedOut" class="mt-n3">
              
              <v-col cols=12>
                <v-alert
                  dense
                  dismissible
                  type="warning">
                  You have been logged out
                </v-alert>
              </v-col>
            </v-row>
        </v-container>
      </v-toolbar>
      
    </header>
  </span>
</template>

<script>
import { mapState } from 'vuex'

import {CkanApi} from '../services/ckanApi'
const ckanServ = new CkanApi()

import { Auth } from '../services/auth';
const authServ = new Auth();

// import User from './user/user'
import About from './pages/about';

export default {
  components: {
    //   User: User
    About: About
  },
  props: [],
  data () {
    let locale = (window.navigator.userLanguage || window.navigator.language).substring(0,2);
    return {
        aboutDialog: false,
        logInUrl: "/api/login?r="+this.$router.history.current.fullPath,
        logoutUrl: "/api/logout?r="+window.location.pathname,
        showLoggedOut: false,
        loadedLanguages: locale === "fr" ? ['fr', 'en'] : ['en'],
        classicUrl: '',
        showSearch: false,
        searchedText: "",
        stayLoggedIn: false,
        findText: this.$store.state.search.searchText ? this.$store.state.search.searchText : "",
        menuSecondary: [
            // {
            //     "title": "What is DataBC?",
            //     "href": "http://www2.gov.bc.ca/gov/content/governments/about-the-bc-government/databc"
            // },
            // {
            //     "title": "Dataset Usage",
            //     "link": "/usage"
            // },
            {
                "title": "Geographic Services",
                "href": "https://www2.gov.bc.ca/gov/content/data/geographic-data-services"
            },
            // {
            //     "title": "Blog",
            //     "href": "https://engage.gov.bc.ca/data/"
            // },
            // {
            //     "title": "Developers",
            //     "href": "https://www.bcdevexchange.org/"
            // },
            {
                "title": "About",
                "link": "/about",
                "dialog": true
            },
            {
                "title": "Contact Data BC",
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
      if (this.$route.query.loggedOut === "true"){
        this.showLoggedOut = true;
      }else{
        this.showLoggedOut = false;
      }

      if ( (!this.loggedIn) && (to.fullPath === "/dataset/create") ){
        this.$router.push("/");
      }

    },
    loggedIn(){
      this.preserveToken();
    }
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
                "title": "Account Settings",
                "link": "/user",
                "loggedIn": true
            },
            {
                "title": "Data Catalogue Home",
                "link": "/"
            },
            {
                "title": "Explore Datasets",
                "link": "/datasets"
            },
            {
                "title": "Explore by Organizations",
                "link": "/organization"
            },
            {
                "title": "Explore Dataset Groups",
               "link": "/groups"
            },
            {
                "icon": "mdi-rss-box",
                "iconColour": "orange",
                "title": "Subscribe to New Data",
                "href": '/api/ckan/rss'
            }
            // {
            //     "icon": "mdi-rss",
            //     "title": "Subscribe to Blog Posts",
            //     "href": "https://engage.gov.bc.ca/data/feed/"
            // },
        ]
    }
  },
  methods:{

      preserveToken: function(){
        let timeOut = 1000 * 60 // 1 minute
        timeOut *= 5; // 5 minutes

        if (this.loggedIn){
          if (!this.stayLoggedIn){
            this.stayLoggedIn = setInterval(this.keepAlive, timeOut);
          }
        }else{
          if (this.stayLoggedIn){
            clearInterval(this.stayLoggedIn);
            this.stayLoggedIn = false;
          }
        }
      },
      
      closeAbout: function(){
        this.aboutDialog = false;
      },

      keepAlive: function(){
        //no need to await as we don't really care about the token here
        authServ.getToken();
      },

      addDataset: async function(){

        if (this.$router.currentRoute.name === 'dataset_view'){
          await this.$store.commit('dataset/clearDataset');
          await this.$store.commit('dataset/clearResource');
          this.$router.push({name: 'dataset_create'});
        }else if (this.$router.currentRoute.name !== "dataset_create"){
          this.$router.push({name: 'dataset_create'});
        }
      },

      setLanguage: function(local){
        if (!this.loadedLanguages.includes(local)){
          var self = this;
          import(/* webpackChunkName: "lang-[request]" */ `@/i18n/${local}.js`).then( (messages) => {
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
        
      },

      search: function(e){
          if (e.keyCode === 13 || e.type === 'click') {
              this.showSearch = false;
              this.$store.commit('search/setSearchText', this.findText);
              this.$store.commit('search/setClearOnRedirect', false);
              this.$router.push('/datasets')
          }
      },

  },
  mounted: function(){
    if (this.$route.query.loggedOut === "true"){
      this.showLoggedOut = true;
    }
    this.$store.dispatch('user/getCurrentUser')

    //let self = this;

    this.preserveToken();

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

  .searchbox {
    height: 55px;
    background: var(--v-text_background-base);
  }

  .headerSpacer{
    top: 0px;
    height: 65px;
  }
  .v-menu__content{
      border-radius: unset;
  }

  .h-100 {
      height: 100% !important;
  }

</style>


<style>
  .searchbox i.theme--light.v-icon{
      color: var(--v-icon-primary);
  }

  .v-application a.title.v-btn {
      font-size: 36px !important;
  }
  .header-button {
      font-size: 16px !important;
  }
  .v-top {
      vertical-align: top;
  }

  #login-btn, #mobile-login-btn, #add-dataset-btn, #mobile-add-dataset-btn{
    font-weight: bold;
  }

  .gov-header{
    position: fixed;
    width: 100%;
    top: 0px;
    z-index: 100;
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
       background-color: var(--v-menu_secondary-base);
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
       background-color: var(--v-menu_secondary-base);
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
       border-bottom-color: var(--v-govYellow-base) !important;
       border-bottom-width: 2px !important;
       border-bottom-style: solid !important;
   }

   .gov-yellow-border-top{
       border-top-color: var(--v-govYellow-base) !important;
       border-top-width: 2px !important;
       border-top-style: solid !important;
   }

   .not-rounded{
       border-radius: 0px !important;
   }

  .v-text-field.v-text-field--solo .v-input__slot{
    box-shadow: unset !important;
    margin-bottom: 0px !important;
  }

  .header-container {
      height: 65px !important;
  }

  .header-row {
      height: 65px !important;
  }

  .searchRow{
    background: var(--v-data_background-base);
    border: 2px solid;
    border-color: var(--v-primary-base);
    border-radius: 2px;
    border-top: 0;
    height: 100%;
    min-height: 80px;
  }

</style>

<style>
    .v-overlay--active .v-overlay__scrim{
      background: rgb(0, 0, 0) !important;
      opacity: .5 !important;
    }

    .v-dialog.v-dialog--active{
      background: none;
      box-shadow: none
    }

    .v-dialog.v-dialog--active{
      margin: 0;
    }
</style>
