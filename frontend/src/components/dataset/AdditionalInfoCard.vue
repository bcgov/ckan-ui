<template>
  <v-card flat style="margin-bottom:.5rem;">
    <v-container style="padding-top:0px;">
      <h4>Additional Information</h4>
      <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
        <v-layout column justify-start flex>
            <h6>Purpose</h6>
            <p>This is the most purposeful purpose</p>
            <h6>Data Quality</h6>
            <p>This is all about qulaity</p>
            <h6>Lineage Statement</h6>
            <p>This statement is on the lineage</p>
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