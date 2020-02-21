<template>
  <footer class="footer">
      <v-container class="py-0 px-12">
      <!-- Navbar content -->
        <v-row>
            <v-btn depressed text class="px-3 pt-2 mx-0" id="footer-home" href="https://www.gov.bc.ca/">{{$tc('Home')}}</v-btn>
            <v-btn depressed text class="px-3 pt-2 mx-0" id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">{{$tc('About gov.bc.ca')}}</v-btn>
            <v-btn depressed text class="px-3 pt-2 mx-0" id="footer-disclaimer" href="http://gov.bc.ca/disclaimer/">{{$tc('Disclaimer')}}</v-btn>
            <v-btn depressed text class="px-3 pt-2 mx-0" id="footer-privacy" href="http://gov.bc.ca/privacy/">{{$tc('Privacy')}}</v-btn>
            <v-btn depressed text class="px-3 pt-2 mx-0" id="footer-accessibility" href="http://gov.bc.ca/webaccessibility/">{{$tc('Accessibility')}}</v-btn>
            <v-btn depressed text class="px-3 pt-2 mx-0" id="footer-copyright" href="http://gov.bc.ca/copyright">{{$tc('Copyright')}}</v-btn>
            <v-btn depressed text class="px-3 pt-2 mx-0" href="https://www2.gov.bc.ca/gov/content/home/contact-us">{{$tc('Contact Us')}}</v-btn>
        </v-row>
      </v-container>
  </footer>
</template>

<script>

export default {
  components: {

  }
}
</script>

<style>
    .footer .container{
        min-height: 45px;
        background-color: var(--v-primary-base);
        min-width: 100%;
        /* z-index: 100; */
        bottom: 0;
        position: absolute;
        border-top-color: #e3a82b !important;
        border-top-width: 2px !important;
        border-top-style: solid !important;
    }

    .footer a {
        color: #fff!important;
        text-decoration: none;
    }
    .a--active.footer:before, .a.footer:focus:before, .a.footer:hover:before {
        background: none !important;
    }
</style>
