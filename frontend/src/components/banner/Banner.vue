<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
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
        message: 'Tuesday, December 13, 2022, between 7:30 am and 1:00 pm, "BC Geographic Warehouse Custom Downloads" resources will be unavailable due to a routine upgrade.\n For any questions, please create a ticket with Data Systems and Services.',
        action: 'https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/1',
        actionText: 'Create a Ticket',
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
