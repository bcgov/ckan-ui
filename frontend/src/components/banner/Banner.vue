<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
      <span>
        Please note that there is a scheduled outage of the Distribution Service (DWDS) from 9 am to 12 pm on March 3rd, 2026. Users may not be able to order data from BC Geographic Warehouse but the data catalogue pages, datasets and other resources will be continue to be available to users during the outage window. If you have any questions or concerns, please contact us by opening a ticket with the <a href="https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/7" target="_blank">Data Systems and Services request system.</a>
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
        message: 'Please note that there is a scheduled outage of the Distribution Service (DWDS) from 9 am to 12 pm on March 3rd, 2026. Users may not be able to order data from BC Geographic Warehouse but the data catalogue pages, datasets and other resources will be continue to be available to users during the outage window. If you have any questions or concerns, please contact us by opening a ticket with the <a href="https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/7" target="_blank">Data Systems and Services request system.</a>',
        action: '',
        actionText: '',
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
