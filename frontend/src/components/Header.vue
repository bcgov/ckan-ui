<template>
  <header>
    <v-toolbar color="#003366" dark>
      <!-- Navbar content -->
        <a href="https://www2.gov.bc.ca">
          <img
              src="@/assets/images/17_gov3_bc_logo.svg"
              width="152" height="55"
              alt="B.C. Government Logo">
        </a>
      <v-toolbar-title><v-btn class="title" flat to="/">Data Catalogue</v-btn></v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn flat id="nav-login" v-if="loggedIn" class="navbar-link lvl2-link" href="/user">{{user.displayName}}</v-btn>
        <v-btn flat id="nav-login" v-else class="navbar-link lvl2-link" :href="logInUrl">Log in</v-btn>


        <v-btn icon v-on:click="showSearch = !showSearch">
          <v-icon x-large>search</v-icon>
        </v-btn>


        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon x-large>menu</v-icon>
            </v-btn>
          </template>
          <v-toolbar color="#38598a" dark>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn flat id="nav-whatis" class="navbar-link lvl2-link" href="http://www2.gov.bc.ca/gov/content/governments/about-the-bc-government/databc">What is DataBC?</v-btn>
              <v-btn flat id="nav-usages" class="navbar-link lvl2-link" href="/data/site-usage/dataset">Dataset Usage</v-btn>
              <v-btn flat id="nav-geoserv" class="navbar-link lvl2-link" href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services">Geographic Services</v-btn>
              <v-btn flat id="nav-blog" class="navbar-link lvl2-link" href="https://engage.gov.bc.ca/data/">Blog</v-btn>
              <v-btn flat id="nav-devel" class="navbar-link lvl2-link" href="https://www.bcdevexchange.org/">Developers</v-btn>
              <v-btn flat id="nav-contact" class="navbar-link lvl2-link" href="https://forms.gov.bc.ca/databc-contact-us/">Contact</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-toolbar color="#5475a7" dark>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn flat id="ribbon-search" class="navbar-link lvl2-link" to="/dataset">Datasets</v-btn>
              <v-btn flat id="ribbon-org" class="navbar-link lvl2-link" to="/organization">Organizations</v-btn>
              <v-btn flat id="ribbon-groups" class="navbar-link lvl2-link" to="/groups">Groups</v-btn>
              <v-btn flat id="ribbon-registry" class="navbar-link lvl2-link" to="/"><i class="fa fa-rss icon-rss"></i> Stay Up To Date</v-btn>
              <v-btn flat id="ribbon-admin" class="navbar-link lvl2-link" to="/about">About</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-menu>

    </v-toolbar>
    <v-container v-if="showSearch">
      <v-layout row wrap>
        <v-flex>
          <v-text-field label="Search Datasets..." v-model="searchText" outline v-on:keyup="search"></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>


  </header>
</template>

<script>
import {Auth} from '../services/auth'
const authServ = new Auth()

export default {
  components: {
  },
  props: [],
  data () {
    return {
        user: null,
        loggedIn: false,
        logInUrl: "/api/login",
        searchText: "",
        showSearch: false
    }
  },
  methods:{
      search: function(e){
          if (e.keyCode === 13) {
              this.$router.push('/?q=' + this.searchText)
              this.showSearch = false
          }
      }
  },
  mounted: function(){
    if ( (localStorage.user) && (JSON.parse(localStorage.user).jwt) ){
      let user = JSON.parse(localStorage.user);
      let currDate = new Date();

      let base64Url = user.jwt.split('.')[1];
      let base64 = base64Url.replace('-', '+').replace('_', '/');
      let jwtObj = JSON.parse(window.atob(base64));
      let exp = new Date(0);
      exp.setUTCSeconds(jwtObj.exp);

      if (currDate > exp) {
          localStorage.removeItem('user');
          authServ.getToken().then((data) => {
              if ((typeof(data.error) === "undefined") && (typeof(data) === "object")) {
                  this.user = data;
                  this.loggedIn = true;
                  localStorage.user = JSON.stringify(data);
              }
          });
      } else {
          this.loggedIn = true;
          this.user = user;
      }
    }else{
      authServ.getToken().then((data) => {
          if ((typeof(data.error) === "undefined") && (typeof(data) === "object")) {
              this.user = data;
              this.loggedIn = true;
              localStorage.user = JSON.stringify(data);

          }
      });
    }
  },
}
</script>