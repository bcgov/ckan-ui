<template>
  <footer class="footer">
      <v-container class="pa-0">
      <!-- Navbar content -->
        <v-row>
            <v-btn text id="footer-home" href="https://www.gov.bc.ca/">{{$tc('Home')}}</v-btn>
            <v-btn text id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">{{$tc('About gov.bc.ca')}}</v-btn>
            <v-btn text id="footer-disclaimer" href="http://gov.bc.ca/disclaimer/">{{$tc('Disclaimer')}}</v-btn>
            <v-btn text id="footer-privacy" href="http://gov.bc.ca/privacy/">{{$tc('Privacy')}}</v-btn>
            <v-btn text id="footer-accessibility" href="http://gov.bc.ca/webaccessibility/">{{$tc('Accessibility')}}</v-btn>
            <v-btn text id="footer-copyright" href="http://gov.bc.ca/copyright">{{$tc('Copyright')}}</v-btn>
            <v-btn text href="https://www2.gov.bc.ca/gov/content/home/contact-us">{{$tc('Contact Us')}}</v-btn>
        </v-row>
      </v-container>
  </footer>
</template>

<script>
export default {

}
</script>

<style>

.footer .container{
  min-height: 45px;
  background-color: var(--v-primary-base);
  min-width: 100%;
  z-index: 100;
}

.footer a {
  color: #fff!important;
  text-decoration: none;
}
.v-btn--active.footer:before, .v-btn.footer:focus:before, .v-btn.footer:hover:before {
    background: none !important;
  }
</style>
