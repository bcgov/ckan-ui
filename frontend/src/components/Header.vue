<template>
  <header>
    <b-navbar type="dark" class="navbar-expand-lg d-print-block" bg-variant="primary">
      <!-- Navbar content -->
      <b-container>
        <a class="navbar-brand" href="https://www2.gov.bc.ca">
          <img
              class="nav-logo img-fluid d-none d-sm-block"
              src="@/assets/images/17_gov3_bc_logo.svg"
              width="152" height="55"
              alt="B.C. Government Logo">
          <img
              class="img-fluid d-none d-sm-block nav-logo-print"
              src="@/assets/images/17_gov3_bc_logo_transparent.svg"
              width="152" height="55"
              alt="B.C. Government Logo">
          <img
              class="nav-logo img-fluid d-sm-none"
              src="@/assets/images/01_gov3_bc_symbol.svg"
              width="61"
              height="43"
              alt="B.C. Government Logo">
        </a>
        <b-navbar-nav>
          <li class="bc-nav-title d-none d-md-block">Data Catalogue</li>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-navbar-toggle class="d-sm-none" target="nav_collapse"></b-navbar-toggle>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <input class="d-none d-md-block" type="text" placeholer="Search datasets..."/>
        </b-navbar-nav>
      </b-container>
    </b-navbar>
    <b-navbar class="bc-nav-pri-links py-0" toggleable="sm" type="dark">
      <b-container fluid>
        <b-collapse class="py-2" is-nav id="nav_collapse">
          <b-container id="navContainer">
            <b-nav-text class="d-sm-none text-light">Data Catalogue</b-nav-text>
            <b-navbar-nav class="catalogue-nav">
              <b-nav-item id="nav-whatis" class="navbar-link lvl2-link" href="http://www2.gov.bc.ca/gov/content/governments/about-the-bc-government/databc">What is DataBC?</b-nav-item>
              <b-nav-item id="nav-usages" class="navbar-link lvl2-link" href="/data/site-usage/dataset">Dataset Usage</b-nav-item>
              <b-nav-item id="nav-geoserv" class="navbar-link lvl2-link" href="https://www2.gov.bc.ca/gov/content/data/geographic-data-services">Geographic Services</b-nav-item>
              <b-nav-item id="nav-blog" class="navbar-link lvl2-link" href="https://engage.gov.bc.ca/data/">Blog</b-nav-item>
              <b-nav-item id="nav-devel" class="navbar-link lvl2-link" href="https://www.bcdevexchange.org/">Developers</b-nav-item>
              <b-nav-item id="nav-contact" class="navbar-link lvl2-link" href="https://forms.gov.bc.ca/databc-contact-us/">Contact</b-nav-item>
            </b-navbar-nav>
          </b-container>
        </b-collapse>
      </b-container>
    </b-navbar>
    <b-navbar class="bc-nav-links py-0" toggleable="sm" type="dark">
      <b-container fluid>
        <b-collapse class="py-2" is-nav id="nav_collapse">
          <b-container id="navContainer">
            <b-nav-text class="d-sm-none text-light">Data Catalogue</b-nav-text>
            <b-navbar-nav class="catalogue-nav">
              <b-nav-item id="ribbon-search" class="navbar-link lvl2-link" href="/dataset">Datasets</b-nav-item>
              <b-nav-item id="ribbon-org" class="navbar-link lvl2-link" href="/organization">Organizations</b-nav-item>
              <b-nav-item id="ribbon-groups" class="navbar-link lvl2-link" href="/groups">Groups</b-nav-item>
              <b-nav-item id="ribbon-registry" class="navbar-link lvl2-link" href="/gwells/registries"><i class="fa fa-rss icon-rss"></i> Stay Up To Date</b-nav-item>
              <b-nav-item id="ribbon-admin" class="navbar-link lvl2-link" href="/about">About</b-nav-item>
            </b-navbar-nav>
          </b-container>
        </b-collapse>
      </b-container>
    </b-navbar>
  </header>
</template>

<script>

export default {
  components: {
  },
  props: [],
  data () {
    return {
    }
  },
}
</script>

<style lang="scss">
@import '~bootstrap/scss/_functions';
@import '~bootstrap/scss/_variables';
@import '~bootstrap/scss/mixins/_breakpoints';

.navbar {
  margin-bottom: 0px;
}
.nav-item {
  font-size: 13px;
}
.bc-nav-title {
  font-size: 2em;
  color: #fff!important;
  margin-bottom: -10px;
  margin-left: 10px;
}
.bc-nav-pri-links {
  background-color: #38598a;
  border-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}
.bc-nav-links {
  background-color: #5475a7;
  border-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  -webkit-box-shadow: 0px 3px 3px 1px rgba(51, 51, 51, 0.5);
  -moz-box-shadow: 0px 3px 3px 1px rgba(51, 51, 51, 0.5);
  box-shadow: 0px 3px 3px 1px rgba(51, 51, 51, 0.5);
}
header li + li {
  @include media-breakpoint-up(sm) {
    border-left: 1px solid #748bad;
  }
}

.lvl2-link a {
  padding-top:0;
  padding-bottom:0;
}
.nav-logo-print {
  height: 0px !important;
}
@media print {
  header nav {
    background-color: rgba(0,0,0,0) !important;
    border-bottom: none !important;
  }
  .bc-nav-title {
    color: #000 !important;
  }
  .nav-logo-print {
    height: 55px !important;
  }
  .nav-logo {
    height: 0px !important;
  }
}
</style>
