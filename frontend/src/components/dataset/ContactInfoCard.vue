<template>
  <v-card flat style="margin-bottom:.5rem;">
    <h3>Contact Information</h3>
    <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
      <v-layout v-for="contact in dataset.contacts" :key="contact.email" column justify-start flex>
        <template v-if="contact.private == 'Display'">
          <h4>{{contact.name}}</h4>
            <h5>Role</h5> <span>{{roles[contact.role]}}</span>
            <h5>Email</h5> <span><a :href="contact.email">{{contact.email}}</a></span>
            <h5>Organization</h5> <span>{{orgTitle(contact.organization)}}</span>
            <h5>Sub-Organization</h5> <span>{{orgTitle(contact.branch)}}</span>
        </template>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default{
  data() {
    return {
      roles: {
        'pointOfContact': 'Point of Contact'
      }
    }
  },
  computed: {
    ...mapState({
      dataset: state => state.dataset.dataset,
    }),
    ...mapGetters('organization', {
      orgTitle: 'titleByID'
    })
  }
}
</script>

<style scoped>
  @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

  .container{
      padding-bottom:15px;
  }
</style>