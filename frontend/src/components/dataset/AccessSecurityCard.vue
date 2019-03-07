<template>
  <v-card flat style="margin-bottom:.5rem;">
    <h3>Access and Security</h3>
    <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
      <v-layout column justify-start flex>
          <h5>Who can view this dataset?</h5>
          <p>{{info.viewAudience}}</p>
          <h5>Who can download this dataset?</h5>
          <p>{{info.downloadAudience}}</p>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default{
    props: {
        info: Object
    },
}
</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    .container{
        padding-bottom:15px;
    }
</style>