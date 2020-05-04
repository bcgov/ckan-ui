<template>
  <footer class="footer">
      <v-toolbar color="primary" flat dense class="px-md-10">
      <v-container class="py-0">
      <!-- Navbar content -->
        <v-row class="h-100">
            <v-col cols=12 class="py-0 h-100">
                <v-btn depressed text class="px-3 mx-0 v-top" id="footer-home" href="https://www.gov.bc.ca/">{{$tc('Home')}}</v-btn>
                <v-btn depressed text class="px-3 mx-0 v-top" id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">{{$tc('About gov.bc.ca')}}</v-btn>
                <v-btn depressed text class="px-3 mx-0 v-top" id="footer-disclaimer" href="http://gov.bc.ca/disclaimer/">{{$tc('Disclaimer')}}</v-btn>
                <v-btn depressed text class="px-3 mx-0 v-top" id="footer-privacy" href="http://gov.bc.ca/privacy/">{{$tc('Privacy')}}</v-btn>
                <v-btn depressed text class="px-3 mx-0 v-top" id="footer-accessibility" href="http://gov.bc.ca/webaccessibility/">{{$tc('Accessibility')}}</v-btn>
                <v-btn depressed text class="px-3 mx-0 v-top" id="footer-copyright" href="http://gov.bc.ca/copyright">{{$tc('Copyright')}}</v-btn>
                <v-btn depressed text class="px-3 mx-0 v-top" href="https://www2.gov.bc.ca/gov/content/home/contact-us">{{$tc('Contact Us')}}</v-btn>
            </v-col>
        </v-row>
      </v-container>
      </v-toolbar>
  </footer>
</template>

<script>

export default {
  components: {

  }
}
</script>

<style>
    .footer {
        min-height: 45px;
        background-color: var(--v-primary-base);
        min-width: 100%;
        /* z-index: 100; */
        bottom: 0;
        position: absolute;
        border-top-color: var(--v-govYellow-base) !important;
        border-top-width: 2px !important;
        border-top-style: solid !important;
    }

    .footer a {
        color: var(--v-text-base) !important;
        text-decoration: none;
    }
    .a--active.footer:before, .a.footer:focus:before, .a.footer:hover:before {
        background: none !important;
    }
    .h-100 {
      height: 100% !important;
    }
    .v-top {
      vertical-align: top;
    }
</style>
