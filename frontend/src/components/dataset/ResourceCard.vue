<template>
  <v-card hover style="margin-bottom:.5rem" >
    <v-container fluid>
      <v-layout row wrap align-center fill-height>
        <v-flex xs12>
          <h4><i class="fa fa-file"></i> {{resource.name}}</h4>
          <span><strong>Type: </strong>{{resource.format}}</span>
        </v-flex>
      </v-layout>
      <v-layout row wrap align-center fill-height>
        <v-flex xs6>
          <v-btn flat block color="secondary">Download&nbsp;<i class="fa fa-download float-right"></i></v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn flat block color="secondary">More&nbsp;<i class="fa fa-caret-down"></i></v-btn>
        </v-flex>
      </v-layout>
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