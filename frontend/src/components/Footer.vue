<template>
  <footer class="footer">
      <v-container class="py-0 px-12">
      <!-- Navbar content -->
        <v-row>
            <a class="px-3 pt-2" id="footer-home" href="https://www.gov.bc.ca/">{{$tc('Home')}}</a>
            <a class="px-3 pt-2" id="footer-about" href="https://www2.gov.bc.ca/gov/content/about-gov-bc-ca">{{$tc('About gov.bc.ca')}}</a>
            <a class="px-3 pt-2" id="footer-disclaimer" href="http://gov.bc.ca/disclaimer/">{{$tc('Disclaimer')}}</a>
            <a class="px-3 pt-2" id="footer-privacy" href="http://gov.bc.ca/privacy/">{{$tc('Privacy')}}</a>
            <a class="px-3 pt-2" id="footer-accessibility" href="http://gov.bc.ca/webaccessibility/">{{$tc('Accessibility')}}</a>
            <a class="px-3 pt-2" id="footer-copyright" href="http://gov.bc.ca/copyright">{{$tc('Copyright')}}</a>
            <a class="px-3 pt-2" href="https://www2.gov.bc.ca/gov/content/home/contact-us">{{$tc('Contact Us')}}</a>
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
