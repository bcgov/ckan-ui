<template>
  <v-banner v-if="message" :color="colour" class="mx-md-n11 px-md-11 mt-n3" icon="mdi-information" elevation=0 tile>
    <span>
      Please note that there is a new version of BC Data Catalogue in our <a href="https://toyger.data.gov.bc.ca/">test environment</a>.
      The upgrade includes schema changes and if you or your clients use APIs to access, view or edit your datasets and resources, the schema changes will affect your current setup.
      Please contact us using our JSM channel <a href="https://dpdd.atlassian.net/servicedesk/customer/portal/1/group/1/create/18">Provide Feedback - Data Systems & Services - Jira Service Management (atlassian.net)</a>
      for further guidance and test your applications using our <a href="http://toyger.data.gov.bc.ca/api">TEST API</a>. Testing window is open until August 15th.
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
        message: 'Please note that there is a new version of BC Data Catalogue in our test environment (<a>https://toyger.data.gov.bc.ca/</a>).'
                + ' The upgrade includes schema changes and if you or your clients use APIs to access, view or edit your datasets and resources, the schema changes will affect your current setup.'
                + ' Please refer contact us using our JSM channel Provide Feedback - Data Systems & Services - Jira Service Management (atlassian.net)'
                + 'for further guidance and test your applications using our TEST API (<a>http://toyger.data.gov.bc.ca/api</a>). Testing window is open until August 15th.',
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
