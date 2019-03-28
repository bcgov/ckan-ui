<template>
  <header class="gov-header">
    <v-toolbar color="primary" dark>
      <!-- Navbar content -->
        <a href="https://www2.gov.bc.ca">
          <img
              src="@/assets/images/17_gov3_bc_logo.svg"
              width="152" height="55"
              alt="B.C. Government Logo">
        </a>
      <v-toolbar-title color="primary"><v-btn class="title hidden-sm-and-down" color="text" flat to="/">{{$tc("DataCatalogue")}}</v-btn></v-toolbar-title>
        <v-spacer></v-spacer>


        <v-btn flat id="nav-old" v-if="classicUrl" class="navbar-link lvl2-link hidden-sm-and-down" :href="classicUrl">{{$tc('Classic')}}</v-btn>

        <User v-if="loggedIn" :user="user"></User>
        <v-btn flat id="nav-login" v-else class="navbar-link lvl2-link hidden-sm-and-down" :href="logInUrl">{{$tc("LogIn")}}</v-btn>

        <v-menu offset-y bottom color="primary">
          <template v-slot:activator="{ on }">
            <v-btn flat v-on="on">
              {{$tc("Language")}}
            </v-btn>
          </template>
          <v-layout align-center justify-center row fill-height class="secondary_color">
              <v-flex xs12>
                  <v-list class="header-menu-secondary" dark>
                    <v-list-tile @click="setLanguage('en')">English</v-list-tile>
                    <v-list-tile @click="setLanguage('fr')">Français</v-list-tile>
                  </v-list>
              </v-flex>
          </v-layout>
        </v-menu>

        <v-btn icon v-on:click="searchClick">
          <v-icon x-large>search</v-icon>
        </v-btn>


        <v-menu bottom left color="primary">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon x-large>menu</v-icon>
            </v-btn>
          </template>
          <v-layout align-center justify-center row fill-height class="secondary_color">
              <v-flex xs6>
                  <v-list class="header-menu" dark>
                    <v-list-tile v-for="(item, key) in menuSecondary" :key="'secondary-menu-'+key">
                        <v-btn flat :to="item.link" class="navbar-link lvl2-link">{{$tc(item.title)}}</v-btn>
                    </v-list-tile>
                    <v-list-tile class="hidden-md-and-up">
                      <v-btn flat id="nav-old" v-if="classicUrl" class="navbar-link lvl2-link" :href="classicUrl">{{$tc('Classic')}}</v-btn>
                    </v-list-tile>
                    <v-list-tile v-if="loggedIn" class="hidden-md-and-up">
                        <User :user="user"></User>
                    </v-list-tile>
                    <v-list-tile v-else class="hidden-md-and-up">
                        <v-btn flat id="nav-login" class="navbar-link lvl2-link" :href="logInUrl">{{$tc("LogIn")}}</v-btn>
                    </v-list-tile>
                  </v-list>
              </v-flex>
              <v-flex xs6>
                  <v-list class="header-menu-secondary" dark>
                    <v-list-tile v-for="(item, key) in menuTertiary" :key="'tertiarry-menu-'+key">
                        <v-btn v-if="item.link" flat :to="item.link" class="navbar-link lvl2-link"><v-icon v-if="item.icon">{{item.icon}}</v-icon>{{$tc(item.title)}}</v-btn>
                        <v-btn v-else flat :href="item.href" class="navbar-link lvl2-link"><v-icon v-if="item.icon">{{item.icon}}</v-icon>{{$tc(item.title)}}</v-btn>
                    </v-list-tile>
                  </v-list>
              </v-flex>
          </v-layout>
        </v-menu>

    </v-toolbar>
    <v-container v-if="showSearch">
      <v-layout row wrap>
        <v-flex>
          <v-text-field :label="$tc('SearchDatasets')" v-model="searchText" outline v-on:keyup="search"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>


  </header>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

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
        logInUrl: "/api/login",
        searchText: "",
        showSearch: false,
        classicUrl: '',
        menuSecondary: [
            {
                "title": "What is DataBC?",
                "link": "http://www2.gov.bc.ca/gov/content/governments/about-the-bc-government/databc"
            },
            // {
            //     "title": "Dataset Usage",
            //     "link": "/usage"
            // },
            {
                "title": "Geographic Services",
                "link": "https://www2.gov.bc.ca/gov/content/data/geographic-data-services"
            },
            {
                "title": "Blog",
                "link": "https://engage.gov.bc.ca/data/"
            },
            {
                "title": "Developers",
                "link": "https://www.bcdevexchange.org/"
            },
            {
                "title": "Contact",
                "link": "https://forms.gov.bc.ca/databc-contact-us/"
            }
        ]
    }
  },
  computed: {
    ...mapState({
      user: state => state.user.authUser
    }),
    ...mapGetters('user', {
      loggedIn: 'isLoggedIn'
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
            //{
            //    "title": "Groups",
            //    "link": "/groups"
            //},
            // {
            //     "icon": "rss_feed",
            //     "title": "Subscribe to new data",
            //     "href": this.classicUrl + '/feeds/recent.rss'
            // },
            {
                "icon": "rss_feed",
                "title": "Subscribe to blog posts",
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
              this.$router.push('/?q=' + this.searchText)
              this.showSearch = false
          }
      },
      searchClick: function(){
          this.showSearch = !this.showSearch
      },

      setLanguage: function(local){
          this.$i18n.locale = local
      }
  },
  mounted: function(){
    this.$store.dispatch('user/getCurrentUser')

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

<style>
   .v-btn--active.title:before, .v-btn.title:focus:before, .v-btn.title:hover:before {
    background: none !important;
  }

   .v-list.header-menu.theme--dark{
       background-color: var(--v-primary-base);
   }

   .v-list.header-menu-secondary.theme--dark{
       background-color: var(--v-secondary-base);
   }

   .secondary_color{
       background-color: var(--v-secondary-base);
   }


</style>
