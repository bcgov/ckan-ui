<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
      {{message}}
      <template v-if="action" v-slot:actions>
          <v-btn :color="colour == 'banner_error' ? 'error' : 'secondary'" 
              :href="action" tile class="white--text" target="_blank">
            {{actionText}}
          </v-btn>
      </template>
      <!-- <a :href="action" target="_blank">{{ actionText }}</a> -->
  </v-banner>
</template>

<script>
export default {
    data() {
      return {
        message: 'The BC Data Catalogue is currently experiencing a service outage. Our team is actively working to resolve the issue as quickly as possible. Thank you for your patience.',
        action: '',
        actionText: '',
        colour: 'banner_error' // RED: banner_error, YELLOW: banner_warning, BLUE: banner_info
      }
    },
}
</script>

<style>
  .v-banner__wrapper {
    border-bottom: none !important;
  }
</style>
