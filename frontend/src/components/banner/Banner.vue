<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile single-line>
      {{message}}
      <template v-if="action" v-slot:actions>
          <v-btn :color="colour == 'banner_error' ? 'error' : 'secondary'" 
              :href="action" tile class="white--text" target="_blank">
            {{actionText}}
          </v-btn>
      </template>
  </v-banner>
</template>

<script>
export default {
    data() {
      return {
        message: 'Please be advised that we are currently experiencing an outage to many of our services, and are working to resolve it as quickly as possible',
        action: '',
        actionText: 'Give Feedback',
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
