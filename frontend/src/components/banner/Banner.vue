<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
      {{message}}
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
        message: 'Publishing your metadata in the BC Data Catalogue is a great way to ensure it complies with the new Metadata Standard and Guidelines. Find these on the ',
        action: 'https://www2.gov.bc.ca/gov/content/data/about-the-metadata-standard',
        actionText: 'Metadata Quick Facts page.',
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
