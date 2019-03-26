<template>
  <footer class="footer">
      <v-container class="pa-0">
      <!-- Navbar content -->
        <v-layout row>
            <v-btn flat id="footer-home" href="https://www.gov.bc.ca/">Home</v-btn>
            <v-btn flat id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">About gov.bc.ca</v-btn>
            <v-btn flat id="footer-disclaimer" href="http://gov.bc.ca/disclaimer/">Disclaimer</v-btn>
            <v-btn flat id="footer-privacy" href="http://gov.bc.ca/privacy/">Privacy</v-btn>
            <v-btn flat id="footer-accessibility" href="http://gov.bc.ca/webaccessibility/">Accessibility</v-btn>
            <v-btn flat id="footer-copyright" href="http://gov.bc.ca/copyright">Copyright</v-btn>
            <v-btn flat href="https://www2.gov.bc.ca/gov/content/home/contact-us">Contact Us</v-btn>
        </v-layout>
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
}

.footer a {
  color: #fff!important;
  text-decoration: none;
}
.v-btn--active.footer:before, .v-btn.footer:focus:before, .v-btn.footer:hover:before {
    background: none !important;
  }
</style>
