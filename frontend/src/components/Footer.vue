<template>
  <footer class="footer">
      <v-container>
      <!-- Navbar content -->
        <v-layout row>
            <a id="footer-home" class="nav-item" href="https://www.gov.bc.ca/">Home</a>
            <v-divider vertical color="lightgray"></v-divider>
            <a id="footer-about" class="nav-item" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">About gov.bc.ca</a>
            <v-divider vertical color="lightgray"></v-divider>
            <a id="footer-disclaimer" class="nav-item" href="http://gov.bc.ca/disclaimer/">Disclaimer</a>
            <v-divider vertical color="lightgray"></v-divider>
            <a id="footer-privacy" class="nav-item" href="http://gov.bc.ca/privacy/">Privacy</a>
            <v-divider vertical color="lightgray"></v-divider>
            <a id="footer-accessibility" class="nav-item" href="http://gov.bc.ca/webaccessibility/">Accessibility</a>
            <v-divider vertical color="lightgray"></v-divider>
            <a id="footer-copyright" class="nav-item" href="http://gov.bc.ca/copyright">Copyright</a>
            <v-divider vertical color="lightgray"></v-divider>
            <a  class="nav-item" href="https://www2.gov.bc.ca/gov/content/home/contact-us">Contact Us</a>
        </v-layout>
      </v-container>
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