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

          <v-btn depressed tile large v-on:click="searchClick" id="header-search" color="#e3a82b" height="100%">
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
                      <template v-for="(item, key) in menuSecondary">
                          <v-list-item v-if="item.link" color="white" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'secondary-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                          <v-list-item v-else-if="item.title !== ''" color="white" :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'secondary-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                      </template>
                    </v-list>
                <!-- </v-col>
                <v-col cols=12 class="primary_color gov-yellow-border-top"> -->
                    <v-list dense class="header-menu-secondary not-rounded gov-yellow-border-bottom">
                      <template v-for="(item, key) in menuTertiary">
                          <v-list-item v-if="item.link" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :to="item.link" :key="'tertiarry-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                          <v-list-item v-else-if="item.title !== ''" left fixed :id="'header-menu-'+item.title.replace(' ', '-').toLowerCase()" :href="item.href" :key="'tertiarry-menu-'+key" v-text="$tc(item.title, 2)"></v-list-item>
                      </template>
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
    <v-container>
      <v-row align-self="end">
        <User v-if="loggedIn" :user="user"></User>
        <v-btn right v-if="this.$i18n.locale != 'en'" text @click="setLanguage('en')">English</v-btn>
        <v-btn right v-if="this.$i18n.locale != 'fr'" text @click="setLanguage('fr')">Français</v-btn>
      </v-row>
    </v-container>
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
