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
        message: 'We welcome your feedback! Help us improve your experience by taking our short 1 minute survey.',
        action: 'https://form.simplesurvey.com/f/s.aspx?s=8d6269f2-2eb0-4dff-86af-09889bda98fe',
        actionText: 'Give Feedback',
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
