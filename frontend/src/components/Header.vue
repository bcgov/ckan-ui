<template>
  <span>
    <v-dialog
      v-model="aboutDialog"
    >
      <div class="aboutD">
        <div class="mx-md-12 my-0 mx-0">
          <About @closeDialog="closeAbout" class="ml-md-5 mr-md-2 mr-0"></About>
        </div>
      </div>
    </v-dialog>

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
                        <v-btn depressed tile large @click="showSearch = false" v-on="on" id="header-menu" color="menu_secondary" height="100%" class="v-top float-right">
                            <v-icon large>mdi-menu</v-icon>
                        </v-btn>
                        </template>
                        <!-- <v-row justify-left fill-height class="secondary_color">
                            <v-col cols=12 class="gov-yellow-border-top"> -->
                                <v-list dense class="header-menu not-rounded gov-yellow-border-bottom">
                                <v-list-item v-if="!loggedIn" color="text" id="mobile-login-btn" class="hidden-md-and-up" :href="logInUrl" @click="clearStorage">{{$tc("LogIn")}}</v-list-item>
                                <v-list-item v-if="showCreate" color="text" id="mobile-add-dataset-btn" class="hidden-md-and-up" :to="{name: 'dataset_create'}">{{$tc("Add Dataset")}}</v-list-item>
                                <template v-for="(item, key) in menuTertiary">

                                    <span :key="'secondary-menu-'+key">
                                    <v-list-item v-if="item.link" color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'secondary-menu-'+key" v-text="$tc(item.title, 2)">
                                      {{$tc(item.title, 2)}}
                                      <v-icon v-if="item.icon" :color="item.iconColour">{{item.icon}}</v-icon>
                                    </v-list-item>
                                    <v-list-item v-else-if="item.title !== ''" color="text" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'secondary-menu-'+key">
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
                                      <v-list-item v-if="item.link" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'tertiarry-menu-'+key">
                                        {{$tc(item.title, 2)}}
                                        <v-icon v-if="item.icon" :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                      <v-list-item v-else-if="item.title !== ''" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'tertiarry-menu-'+key">
                                        {{$tc(item.title, 2)}}
                                        <v-icon :color="item.iconColour">{{item.icon}}</v-icon>
                                      </v-list-item>
                                    </span>
                                </template>
                                <v-list-item v-if="this.$i18n.locale != 'en'" left fixed color="text" id="mobile-english-btn" class="hidden-md-and-up" @click="setLanguage('en')">EN</v-list-item>
                                <v-list-item v-if="this.$i18n.locale != 'fr'" left fixed color="text" id="mobile-french-btn" class="hidden-md-and-up" @click="setLanguage('fr')">FR</v-list-item>
                                </v-list>
                            <!-- </v-col>
                        </v-row> -->
                    </v-menu>
                    <v-btn depressed tile large @click="searchClick" id="header-search" color="govYellow" height="100%" class="v-top float-right">
                        <v-icon large>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn v-if="this.$i18n.locale != 'en'" depressed text large id="english-btn" class="hidden-sm-and-down header-button v-top float-right" @click="setLanguage('en')" height="100%">EN</v-btn>
                    <v-btn v-if="this.$i18n.locale != 'fr'" depressed text large id="french-btn" class="hidden-sm-and-down header-button v-top float-right" @click="setLanguage('fr')" height="100%">FR</v-btn>
                    <v-btn v-if="!loggedIn" depressed text large id="login-btn" class="hidden-sm-and-down header-button v-top float-right" :href="logInUrl" @click="clearStorage" height="100%">{{$tc("LogIn")}}</v-btn>
                    <v-btn v-if="showCreate" depressed text large id="add-dataset-btn" class="hidden-sm-and-down header-button v-top float-right" :to="{name: 'dataset_create'}" height="100%">{{$tc('Add Dataset')}}</v-btn>


                </v-col>
            </v-row>
        </v-container>
      </v-toolbar>
      <v-container class="search-bar gov-yellow-border-bottom gov-yellow-border-top" v-show="showSearch" py-0 px-12>
        <v-row wrap align-content="center" class="search-row">
          <v-col class="py-0">
            <v-text-field
                ref="headerSearch"
                id="header-search"
                :label="$tc('SearchDatasets')"
                v-model="searchText"
                solo
                hide-details
                v-on:keyup="search"
                append-icon="mdi-magnify"
                @click:append="search">
            </v-text-field>
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
        searchText: this.$store.state.search.searchText ? this.$store.state.search.searchText : "",
        aboutDialog: false,
        logInUrl: "/api/login?r="+this.$router.history.current.fullPath,
        logoutUrl: "/api/logout?r="+window.location.pathname,
        showSearch: false,
        loadedLanguages: locale === "fr" ? ['fr', 'en'] : ['en'],
        classicUrl: '',
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
                "title": "Data Catalogue Home",
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
                "href": this.classicUrl + '/feeds/recent.rss'
            },
            // {
            //     "icon": "mdi-rss",
            //     "title": "Subscribe to Blog Posts",
            //     "href": "https://engage.gov.bc.ca/data/feed/"
            // },
        ]
    }
  },
  methods:{

      closeAbout: function(){
        this.aboutDialog = false;
      },

      search: function(e){
          if (e.keyCode === 13 || e.type === 'click') {
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
    height: 65px;
  }
  .v-menu__content{
      border-radius: unset;
  }

  .aboutD{
    width: 100%;
  }

  .h-100 {
      height: 100% !important;
  }

</style>

<style>
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

  .search-bar{
    position: absolute;
    background: white;
    width: 100%;
    max-width: none !important;
    height: 60px;
  }
  .search-row{
      height: 100%;
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
