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
        message: 'Please note that the BC Data Catalogue team will be performing a scheduled server maintenance on 2024/05/28 starting at 5 pm (2 to 4 hours, estimated). Users may encounter temporary disruption to our catalogue services during the scheduled maintenance window. If you have any questions or concerns, please submit a request at the ',
        action: 'https://dpdd.atlassian.net/servicedesk/customer/portal/1',
        actionText: 'Data Systems & Services request system.',
        colour: 'banner_warning' // RED: banner_error, YELLOW: banner_warning, BLUE: banner_info
      }
    },
}
</script>

<style>
  .v-banner__wrapper {
    border-bottom: none !important;
  }
</style>
