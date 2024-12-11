<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
      <span>
        The BC Data Catalogue upgrade is successfully complete. Please find out more information at 
        <a href="https://www2.gov.bc.ca/gov/content/data/finding-and-sharing/bc-data-catalogue/bc-catalogue-service-disruptions" target="_blank">BC Catalogue service disruptions</a>
        page.
      </span>
      <template v-if="action" v-slot:actions>
          <v-btn :color="colour == 'banner_error' ? 'error' : 'secondary'" 
              :href="action" tile class="white--text" target="_blank">
            {{actionText}}
          </v-btn>
      </template>
      <a :href="action" target="_blank">{{ actionText }}</a>
  </v-banner>
</template>

<script>
export default {
    data() {
      return {
        message: 'Please note that there is a planned upgrade and a scheduled outage of the BC Data Catalogue from 12 pm on December 10th to 12 pm on December 11th, 2024. The catalogue pages, datasets and resources will be unavailable to users during the outage window. Please find out more information at BC Catalogue service disruptions page.',
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
