<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
    <span>
      <strong>Help us make government data easier to find: <a href="https://form.simplesurvey.com/f/s.aspx?s=2438885d-b803-4477-808a-f6a34aa1c61f&ds=qOtbDFHGyn">Take the survey now!</a></strong>
      <br>
      Your ideas will directly improve the ability to find BC government data and improve the <a href="https://catalogue.data.gov.bc.ca/">Data Catalogue.</a> 
      This survey will take less than 10 minutes to complete. Your feedback is greatly valued.
    </span>
      <!-- <template v-if="action" v-slot:actions>
          <v-btn :color="colour == 'banner_error' ? 'error' : 'secondary'" 
              :href="action" tile class="white--text" target="_blank">
            {{actionText}}
          </v-btn>
      </template> -->
      <a :href="action" target="_blank">{{ actionText }}</a>
  </v-banner>
</template>

<script>
export default {
    data() {
      return {
        message: 'Help us make government data easier to find: Take the survey now!\n'
                + 'Your ideas will directly improve the ability to find BC government data and improve the Data Catalogue. This survey will take less than 10 minutes to complete. Your feedback is greatly valued.',
        action: '',
        actionText: '',
        colour: 'banner_info' // RED: banner_error, YELLOW: banner_warning, BLUE: banner_info
      }
    },
}
</script>

<style>
  .v-banner__wrapper {
    border-bottom: none !important;
  }
</style>
