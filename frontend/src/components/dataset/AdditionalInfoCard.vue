<template>
  <v-card flat style="margin-bottom:.5rem;">
    <v-container style="padding-top:0px;">
      <h3>Additional Information</h3>
      <v-container style="padding-top:10px;border-left:thin solid lightgrey;">
        <v-layout column justify-start flex>
            <template v-if="dataset.purpose">
              <h5>Purpose</h5>
              <p v-html="purpose"></p>
            </template>
            <template v-if="dataset.data_quality">
              <h5>Data Quality</h5>
              <p v-html="data_quality"></p>
            </template>
            <template v-if="info.lineage_statement">
              <h5>Lineage Statement</h5>
              <p v-html="lineage_statement"></p>
            </template>
            <h5>Tags</h5>
            <v-item-group multiple>
              <v-item v-for="tag in dataset.tags" :key="tag.name">
                <v-chip outline color="#444444" small disabled>{{tag.display_name}}</v-chip>
              </v-item>
            </v-item-group>
        </v-layout>
      </v-container>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import marked from 'marked'
export default{
    props: {
        info: Object
    },
    computed: {
      purpose: function () {
        return marked(this.dataset.purpose, { sanitize: true })
      },
      data_quality: function () {
        return marked(this.dataset.data_quality, { sanitize: true })
      },
      lineage_statement: function () {
        return marked(this.dataset.lineage_statement, { sanitize: true })
      },
      ...mapState({
        dataset: state => state.dataset.dataset
      }),
    }
}
</script>

<style scoped>
    @import "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

    .container{
        padding-bottom:15px;
    }
</style>