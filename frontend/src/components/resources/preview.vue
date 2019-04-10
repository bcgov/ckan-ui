<template>
  <v-card>
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
import {ResourceApi} from "../../services/resourceApi"
const resourceApi = new ResourceApi()

import pdf from 'pdfvuer'

export default{
    components:{
        pdf: pdf,
    },
    props: {
        resource: Object
    },
    data() {
        return {
            type: '',
            name: '',
            url: '',
            loading: true,
            data: [],
            headers: [],
            raw_data: '',
            page: 1,
            numPages: '∞',
            pdfData: null,
        }
    },
    mounted() {
        this.name = this.resource.name;
        this.id = this.resource.id;
        this.loadResource();

    },

    methods: {
        loadResource: function(){
            resourceApi.getResource(this.id).then((data) => {
                this.type = "unknown";

                if ( (data.status === 404) || (data.status === 500) || (data.status === 401) || (data.status === 403) ){
                    this.type = "404";
                }else if (data['type'] === 'xls'){
                    this.type = 'xls'
                }else if (data.headers) {
                    this.type = "csv";
                    this.data = data.workbook
                    this.headers = data.headers
                }else if (data['content-type'] === "application/pdf"){
                    this.type = "pdf"
                    this.url = data.origUrl;
                    var self = this;
                    self.pdfData = pdf.createLoadingTask(data.origUrl);
                    self.pdfData.then(pdf => {
                        self.numPages = pdf.numPages
                    });
                } else {
                    this.raw_data = data.raw_data
                }


                this.loading = false;
            });
        }
    }

}
</script>