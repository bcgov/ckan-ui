<template>
  <v-card flat style="margin-bottom:.5rem;">
    <v-container style="padding-top:0px;">
      <h3>Additional Information</h3>
      <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
        <v-layout column justify-start flex>
            <template v-if="info.purpose">
              <h5>Purpose</h5>
              <p>{{info.purpose}}</p>
            </template>
            <template v-if="info.dataQuality">
              <h5>Data Quality</h5>
              <p>{{info.dataQuality}}</p>
            </template>
            <template v-if="info.lineageStatement">
              <h5>Lineage Statement</h5>
              <p>{{info.lineageStatement}}</p>
            </template>
            <h5>Tags</h5>
            <v-item-group multiple>
              <v-item v-for="tag in info.tags" :key="tag.name">
                <v-chip outline color="#444444" small disabled>{{tag.display_name}}</v-chip>
              </v-item>
            </v-item-group>
        </v-layout>
      </v-container>
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