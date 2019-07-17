<template>
  <v-card class="dialog">
      <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
            <i v-if="loading" class="fa fa-circle-o-notch fa-spin"></i>

            <v-data-table v-else-if="headers.length>0" :items="data" :headers="headers">
                <template v-slot:items="props">
                    <td v-for="(item, key) in props.item" :key="key">{{item}}</td>
                </template>
            </v-data-table>

            <div v-else-if="type === 'pdf'">
                <pdf :src="pdfData" :page="page">
                    <template slot="loading">
                        Loading...
                    </template>
                </pdf>
                <v-layout row wrap>
                    <v-flex xs2></v-flex>
                    <v-flex xs1>
                        <v-btn color="primary" @click="page -= 1">Back</v-btn>
                    </v-flex>
                    <v-flex xs1>{{page}}/{{numPages}}</v-flex>
                    <v-btn color="primary" @click="page += 1">Next</v-btn>
                    <v-flex xs5></v-flex>
                </v-layout>
            </div>

            <div v-else-if="type === '404'">We're sorry we were unable to retrieve your file</div>

            <div v-else>We're sorry we don't currently support previewing this type of file</div>
      </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

import pdf from 'pdfvuer'

export default{
    components:{
        pdf: pdf,
    },
    props: {
        resource: Object,
        resourceIndex: Number
    },
    data() {
        return {
            name: this.resource.name,
            id: this.resource.id,
            page: 1,
        }
    },
    computed: {
        ...mapState({
            resourceStore: state => state.dataset.resources,
        }),
        type: function(){
            return !this.loading && this.resourceStore[this.id] && this.resourceStore[this.id].type ? this.resourceStore[this.id].type : '';
        },
        url: function(){
            return !this.loading && this.resourceStore[this.id] && this.resourceStore[this.id].url ? this.resourceStore[this.id].url : '';
        },
        data: function(){
            return !this.loading && this.resourceStore[this.id] && this.resourceStore[this.id].data ? this.resourceStore[this.id].data : [];
        },
        headers: function(){
            return !this.loading && this.resourceStore[this.id] && this.resourceStore[this.id].headers ? this.resourceStore[this.id].headers : [];
        },
        numPages: function(){
            return !this.loading && this.resourceStore[this.id] && this.resourceStore[this.id].numPages ? this.resourceStore[this.id].numPages : '∞';
        },
        pdfData: function(){
            return !this.loading && this.resourceStore[this.id] && this.resourceStore[this.id].pdfData ? this.resourceStore[this.id].pdfData : null;
        },
        loading: function(){
            return this.resourceStore ? typeof(this.resourceStore[this.id]) === 'undefined' : true;
        }

    },
    mounted() {
        this.$store.dispatch('dataset/getResource', {datasetResourceIndex: this.resourceIndex, id: this.id});
    },

}
</script>

<style scoped>
    .dialog {
        margin-top: 10px;
    }
</style>