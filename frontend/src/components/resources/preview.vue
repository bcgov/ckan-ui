<template>
  <v-card class="dialog">
      <v-toolbar color="primary">
          <v-btn class="no-right-margin" icon @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
          <v-btn v-if="iMapUrl" :href="iMapUrl" target="_blank" color="info" class="text-none mr-0" >View in iMapBC <v-icon right>exit_to_app</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
            <v-progress-circular
                v-if="loading"
                indeterminate
                color="light-blue"
            ></v-progress-circular>

            <v-data-table v-else-if="resource.headers && resource.headers.length>0" :items="resource.workbook" :headers="resource.headers">
                <template v-slot:items="props">
                    <td v-for="(item, key) in props.item" :key="key">{{item}}</td>
                </template>
            </v-data-table>


            <div v-else-if="resource.type === 'openapi-json'">
                <v-row>
                    <v-dialog
                        v-model="getApiKeyDialog">
                        <template v-slot:activator="{ on }">
                            <v-col cols=2>
                                <v-btn color="green" @click="openApiKeyDialog()">Get Api Key<v-icon>lock_open</v-icon></v-btn>
                            </v-col>
                        </template>

                        <v-card>
                            <v-card-text>
                                <iframe width="1000" height="300" :src="apiKeyUrl + '?appName=API%20Console&appSendMessage=true&contentOnly=true'"></iframe>
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="primary"
                                text
                                @click="getApiKeyDialog = false"
                            >
                                Close
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-col cols=2>
                        <v-btn color="green" :href="apiKeyUrl" target="_blank">Manage Api Keys<v-icon>lock_open</v-icon></v-btn>
                    </v-col>
                    <v-col cols=2>
                        <v-btn color="green" @click="clearApiKey()">Clear Api Key</v-btn>
                    </v-col>
                    <v-col cols=2>
                        <v-btn color="green" :href="apiKeyHelpUrl" target="_blank">Api Key Help</v-btn>
                    </v-col>
                </v-row>
                
                <v-row>
                    <v-col cols=12 v-html="redocEle"></v-col>
                </v-row>
            </div>

            <div v-else-if="resource.type && resource.type === 'pdf'">
                <pdf :src="resource.url" :page="page">
                    <template slot="loading">
                        Loading...
                    </template>
                </pdf>
                <v-row wrap>
                    <v-col cols=2></v-col>
                    <v-col cols=1>
                        <v-btn color="primary" @click="page -= 1">Back</v-btn>
                    </v-col>
                    <v-col cols=1>{{page}}/{{resource.numPages}}</v-col>
                    <v-btn color="primary" @click="page += 1">Next</v-btn>
                    <v-col cols=5></v-col>
                </v-row>
            </div>

            <div v-else-if="previewURL" style="margin: 0px -24px -20px">
                <iframe :src="previewURL" frameborder="0" width="100%" :height="winHeight"></iframe>
            </div>

            <div v-else-if="resource.type === '404'">We're sorry we were unable to retrieve your file</div>

            <div v-else>We're sorry we don't currently support previewing this type of file</div>
      </v-card-text>
  </v-card>
</template>

<script>

import pdfvuer from 'pdfvuer';

export default{
    components:{
        pdf: pdfvuer
    },
    props: {
        resource: Object,
        resourceIndex: Number
    },
    data() {
        let API_KEY_ORIGIN = 'https://gwa.apps.gov.bc.ca'
        return {
            name: this.resource.metadata.name,
            id: this.resource.metadata.id,
            page: 1,
            basePreviewURL: '//apps.gov.bc.ca/pub/dmf-viewer/?siteid=7535188336326689232&maponly&wmsservices=',
            apiKey: '',
            getApiKeyDialog: false,
            apiKeyOrigin: API_KEY_ORIGIN,
            apiKeyUrl: API_KEY_ORIGIN+'/ui/apiKeys',
            apiKeyHelpUrl: 'https://github.com/bcgov/gwa/wiki/Developer-Guide'
        }
    },
    computed: {

        previewURL: function(){
            if (!this.loading && this.resource.metadata
                    && this.resource.metadata.preview_info) {
                
                let previewInfo = {}
                try {
                    previewInfo = JSON.parse(previewInfo);
                }catch(ex){
                    previewInfo = this.resource.metadata.preview_info;
                }

                let retURL = this.basePreviewURL + previewInfo.preview_map_service_url;
                retURL += previewInfo.layer_name ? '&wmslayers=' + previewInfo.layer_name : '';
                retURL += previewInfo.preview_latitude && previewInfo.preview_longitude ? '&ll=' + previewInfo.preview_latitude + ',' + previewInfo.preview_longitude : '';
                retURL += previewInfo.preview_zoom_level ? '&z=' + previewInfo.preview_zoom_level : '';
                return retURL;
            }
            return false;
        },
        iMapUrl: function(){
            let previewInfo = {};
            try {
                previewInfo = JSON.parse(previewInfo);
            }catch(ex){
                previewInfo = this.resource.metadata.preview_info
            }

            
            return !this.loading && this.resource.metadata
                    && previewInfo
                    && previewInfo.link_to_imap ? previewInfo.link_to_imap : '';
        },
        loading: function(){
            return false;
        },
        redocEle: function(){
            let ele = "<rapi-doc show-header=false "+ ((this.apiKey !== '') ? ("api-key-value=\"" + this.apiKey) + "\" " : '') + "spec-url='"+this.resource.url+"'></rapi-doc>";
            return ele;
        },
        winHeight: function() {
            return window.innerHeight - 64;
        }

    },
    methods: {
        openApiKeyDialog(){
            let self = this;
            var messageFunc = function(message) {
                if (message.origin == self.apiKeyOrigin){
                    self.getApiKeyDialog = false;
                    self.apiKey = message.data;
                    localStorage.apiKey = self.apiKey;
                    window.removeEventListener('message', messageFunc);
                }
            };
            window.addEventListener('message', messageFunc);
            this.getApiKeyDialog = true;
        },

        clearApiKey(){
            delete localStorage.apiKey; 
            this.apiKey = '';
        }
    },
    mounted() {
        if (typeof(localStorage.apiKey) === "string"){
            this.apiKey = localStorage.apiKey;
        }
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
