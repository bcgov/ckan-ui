<template>
  <v-card flat style="margin-bottom:.5rem;">
    <h3>Contact Information</h3>
    <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
      <v-layout column justify-start flex>
          <h5>Name</h5>
          <p>{{contact.name}} ({{contact.role}})</p>
          <h5>Email</h5>
          <p><a :href="contact.email">{{contact.email}}</a></p>
          <h5>Organization</h5>
          <p>{{contact.organization}}</p>
          <h5>Sub-Organization</h5>
          <p>{{contact.subOrganization}}</p>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default{
    props: {
        contact: Object
    },
}
</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    .container{
        padding-bottom:15px;
    }
</style>