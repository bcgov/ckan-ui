<template>
  <v-card class="dialog">
      <v-toolbar color="primary">
          <v-btn class="no-right-margin" icon @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
            <v-progress-circular
                v-if="loading"
                indeterminate
                color="light-blue"
            ></v-progress-circular>

            <v-data-table v-else-if="headers.length>0" :items="data" :headers="headers">
                <template v-slot:items="props">
                    <td v-for="(item, key) in props.item" :key="key">{{item}}</td>
                </template>
            </v-data-table>

            <div v-else-if="resource.format === 'openapi-json'" v-html="redocEle">
                <div style="border: 1px solid black; overflow-y: scroll" >
                </div>
            </div>

            <div v-else-if="type === 'pdf'">
                <pdf :src="pdfData" :page="page">
                    <template slot="loading">
                        Loading...
                    </template>
                </pdf>
                <v-row wrap>
                    <v-col cols=2></v-col>
                    <v-col cols=1>
                        <v-btn color="primary" @click="page -= 1">Back</v-btn>
                    </v-col>
                    <v-col cols=1>{{page}}/{{numPages}}</v-col>
                    <v-btn color="primary" @click="page += 1">Next</v-btn>
                    <v-col cols=5></v-col>
                </v-row>
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
        },
        redocEle: function(){
            return "<rapi-doc show-header=false spec-url='"+this.resource.url+"'></rapi-doc>"
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

    .theme--light.v-sheet{
        color: var(--v-text-base)
    }

    .no-right-margin{
        margin-right: 0px;
    }
</style>