<template>
  <span>
    <div class="headerSpacer"></div>
    <header class="gov-header">
      <v-toolbar color="primary" fixed dense>
        <!-- Navbar content -->
          <a id="header-gov-logo" href="https://www2.gov.bc.ca">
            <img
                src="@/assets/images/17_gov3_bc_logo.svg"
                width="auto" height="30"
                alt="B.C. Government Logo">
          </a>
        <v-toolbar-title color="primary"><v-btn id="header-home" class="title hidden-sm-and-down" color="text" text to="/">{{$tc("DataCatalogue")}}</v-btn></v-toolbar-title>
          <v-spacer></v-spacer>


          <v-btn text id="nav-old" v-if="classicUrl" class="navbar-link lvl2-link hidden-sm-and-down" :href="classicUrl">{{$tc('Classic')}}</v-btn>

          <User v-if="loggedIn" :user="user"></User>
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
          </v-menu>

          <v-btn icon v-on:click="searchClick" id="header-search">
            <v-icon large>search</v-icon>
          </v-btn>


          <v-menu bottom right offset-y color="primary">
            <template v-slot:activator="{ on }">
              <v-btn icon @click="showSearch = false" v-on="on" id="header-menu">
                <v-icon large>menu</v-icon>
              </v-btn>
            </template>
            <v-row align-center justify-center fill-height class="primary_color">
                <v-col cols=6>
                    <v-list dense class="header-menu">
                      <v-list-item v-for="(item, key) in menuSecondary" :key="'secondary-menu-'+key">
                          <v-btn v-if="item.link" block :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" text :to="item.link" class="navbar-link lvl2-link"><v-icon v-if="item.icon">{{item.icon}}</v-icon>{{$tc(item.title, 2)}}</v-btn>
                          <v-btn v-else-if="item.title !== ''" block :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" text :href="item.href" class="navbar-link lvl2-link"><v-icon v-if="item.icon">{{item.icon}}</v-icon>{{$tc(item.title, 2)}}</v-btn>
                      </v-list-item>
                      <v-list-item class="hidden-md-and-up">
                        <v-btn text id="nav-old" v-if="classicUrl" class="navbar-link lvl2-link" :href="classicUrl">{{$tc('Classic')}}</v-btn>
                      </v-list-item>
                      <v-list-item v-if="loggedIn" class="hidden-md-and-up">
                          <User :user="user"></User>
                      </v-list-item>
                      <v-list-item v-else class="hidden-md-and-up">
                          <v-btn text id="nav-login" class="navbar-link lvl2-link" :href="logInUrl">{{$tc("LogIn")}}</v-btn>
                      </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols=6 class="secondary_color">
                    <v-list dense class="header-menu-secondary">
                      <v-list-item v-for="(item, key) in menuTertiary" :key="'tertiarry-menu-'+key">
                          <v-btn v-if="item.link" block :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" text :to="item.link" class="navbar-link lvl2-link"><v-icon v-if="item.icon">{{item.icon}}</v-icon>{{$tc(item.title, 2)}}</v-btn>
                          <v-btn v-else-if="item.title !== ''" block :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" text :href="item.href" class="navbar-link lvl2-link"><v-icon v-if="item.icon">{{item.icon}}</v-icon>{{$tc(item.title, 2)}}</v-btn>
                      </v-list-item>
                    </v-list>
                </v-col>
            </v-row>
          </v-menu>

      </v-toolbar>
      <v-container class="searchBar" v-show="showSearch">
        <v-row wrap>
          <v-col>
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

import User from './user/user'

export default {
  components: {
      User: User
  },
  props: [],
  data () {
    return {
        searchText: this.$store.state.search.searchText ? this.$store.state.search.searchText : "",
        logInUrl: "/api/login?r="+this.$router.history.current.fullPath,
        showSearch: false,
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
      loggedIn: state => state.user.loggedIn
    }),

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
                "icon": "rss_feed",
                "title": "Subscribe to new data",
                "href": this.classicUrl + '/feeds/recent.rss'
            },
            {
                "icon": "rss_feed",
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
          this.$i18n.locale = local
      },

      clearStorage: function(){
        var keys = Object.keys(localStorage);
        for (var i=0; i<keys.length; i++){
          delete localStorage[keys[i]];
        }
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
       background-color: var(--v-primary-base);
   }

   .theme--light.v-list.header-menu-secondary{
       background-color: var(--v-secondary-base);
   }

   .header-menu .theme--light.v-btn{
      color: var(--v-text-base);
   }

   .navbar-link.theme--light.v-btn{
     color: var(--v-text-base);
   }

   .header-menu-secondary .theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled){
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


</style>
