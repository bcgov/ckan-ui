<template>
  <footer class="footer">
      <v-footer color="#003366" dark>
      <!-- Navbar content -->
        <v-layout row>
            <v-btn flat id="footer-home" href="https://www.gov.bc.ca/">Home</v-btn>
            <v-divider vertical color="lightgray"></v-divider>
            <v-btn flat id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">About gov.bc.ca</v-btn>
            <v-divider vertical color="lightgray"></v-divider>
            <v-btn flat id="footer-disclaimer" href="http://gov.bc.ca/disclaimer/">Disclaimer</v-btn>
            <v-divider vertical color="lightgray"></v-divider>
            <v-btn flat id="footer-privacy" href="http://gov.bc.ca/privacy/">Privacy</v-btn>
            <v-divider vertical color="lightgray"></v-divider>
            <v-btn flat id="footer-accessibility" class="nav-item" href="http://gov.bc.ca/webaccessibility/">Accessibility</v-btn>
            <v-divider vertical color="lightgray"></v-divider>
            <v-btn flat id="footer-copyright" href="http://gov.bc.ca/copyright">Copyright</v-btn>
            <v-divider vertical color="lightgray"></v-divider>
            <v-btn flat href="https://www2.gov.bc.ca/gov/content/home/contact-us">Contact Us</v-btn>
        </v-layout>
      </v-footer>
  </footer>
</template>

<script>
export default {

}
</script>

<style>
.footer {
  @include media-breakpoint-only(xs) {
    height: 8.2rem!important;
    margin-top: 10rem;
  }
  @include media-breakpoint-up(sm) {
    height: 45px!important;
  }
  position: absolute;
  bottom: 0;
  min-width: 100%;
}
.footer .nav-item {
  font-size: 13px;
  padding: .1rem .5rem;
}
.footer .container{
  min-height: 45px;
  background-color: rgb(0, 51, 102);
  min-width: 100%;
}
.footer a {
  color: #fff!important;
  text-decoration: none;
}
footer li+li  {
  @include media-breakpoint-up(sm) {
    border-left: 1px solid #4b5e73;
  }
}
</style>
