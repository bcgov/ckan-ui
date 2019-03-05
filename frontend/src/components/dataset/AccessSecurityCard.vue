<template>
  <v-card flat style="margin-bottom:.5rem;">
    <v-container style="padding-top:0px;">
      <h4>Access and Security</h4>
      <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
        <v-layout column justify-start flex>
            <h6>Who can view this dataset?</h6>
            <p>Public</p>
            <h6>Who can download this dataset?</h6>
            <p>Public</p>
        </v-layout>
      </v-container>
    </v-container>
  </v-card>
</template>

<script>
export default{
    props: {
        resource: Object
    },
}
</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    .container{
        padding-bottom:15px;
    }
</style>