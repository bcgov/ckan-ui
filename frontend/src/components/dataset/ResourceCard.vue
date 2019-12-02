<template>
    <v-card hover style="margin-bottom:.5rem">
        <v-container fluid>
            <v-row wrap align-center fill-height>
                <v-col cols=12>
                    <h4>
                        <v-icon>insert_drive_file</v-icon>
                        {{useResource.metadata.name}}
                    </h4>
                    <span>
                        <strong>Type:</strong>
                        {{useResource.metadata.format}}
                    </span>
                </v-col>
            </v-row>
            <v-row wrap align-center fill-height>
                <v-col cols=6 v-if="!loadPOW">
                    <v-btn text block color="secondary" :href="useResource.metadata.url">
                        Download&nbsp;
                        <v-icon>cloud_download</v-icon>
                    </v-btn>
                </v-col>
                <v-col cols=6 v-else>
                    <powButton :resource="useResource.metadata"/>
                </v-col>
                <v-col cols=6>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on: menu }">
                            <v-btn text block color="secondary" v-on="{...menu}">
                                More&nbsp;
                                <v-icon>menu</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item v-if="!datasetBeingEdited">
                                <v-list-item flat @click.stop="viewDialog = true">View</v-list-item>
                                <v-dialog
                                    eager
                                    v-model="viewDialog"
                                    fullscreen
                                    
                                    transition="dialog-bottom-transition"
                                >
                                    <EditResource
                                        :edit="false"
                                        :resource="useResource.metadata"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="viewDialog = false"
                                    ></EditResource>
                                </v-dialog>
                            </v-list-item>
                            <v-list-item v-if="!datasetBeingEdited">
                                <v-list-item flat @click.stop="dialog = true">Preview</v-list-item>
                                <v-dialog
                                    eager
                                    v-model="dialog"
                                    fullscreen
                                    transition="dialog-bottom-transition"
                                >
                                    
                                    <Preview
                                        :resource="useResource"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="dialog = false"
                                    ></Preview>
                                </v-dialog>
                            </v-list-item>
                            <v-list-item v-if="!!useResource.hasSchema">
                                <v-list-item flat @click.stop="schemaDialog = true">View Schema (JSON Table Schema)</v-list-item>
                                <v-dialog
                                    eager
                                    v-model="schemaDialog"
                                    fullscreen
                                    transition="dialog-bottom-transition"
                                >
                                    <JsonTable
                                        :resource="useResource"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="schemaDialog = false"
                                    ></JsonTable>
                                </v-dialog>
                            </v-list-item>
                            
                            <v-list-item v-if="showEdit">
                                <v-list-item @click.stop="editDialog = true">Edit</v-list-item>
                                <v-dialog
                                    eager
                                    v-model="editDialog"
                                    fullscreen
                                    transition="dialog-bottom-transition"
                                    
                                >
                                    <EditResource
                                        :edit="true"
                                        :resource="useResource.metadata"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="editDialog = false"
                                    ></EditResource>
                                </v-dialog>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item @click="deleteResource" class="red--text" v-if="canDelete">Delete</v-list-item>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
import Preview from "../resources/preview";
import JsonTable from "../resources/jsontable";
import EditResource from "../resources/edit";
import powButton from "../pow/powButton"
import {CkanApi} from '../../services/ckanApi'
const ckanServ = new CkanApi()

export default {
    props: {
        resource: Object,
        resourceIndex: Number,
        showEdit: Boolean,
        datasetBeingEdited: Boolean,
        canDelete: {
            type: Boolean,
            default: false,
        },
    },
    
    components: {
        Preview: Preview,
        JsonTable: JsonTable,
        EditResource: EditResource,
        powButton: powButton
    },
    methods: {
        deleteResource: function(){
            ckanServ.deleteResource(this.resource.id).then( () => {
                location.reload();
            });
        }
    },
    computed: {
        loadPOW: function() {
            return (this.resource.bcdc_type=="geographic" && ("object_name" in this.resource) && this.resource.name.toLowerCase().indexOf("custom download") !== -1);
        }
    },

    mounted() {
        let self = this;
        this.$store.dispatch('dataset/getResource', {datasetResourceIndex: this.resourceIndex, id: this.resource.id});
        let unsub = this.$store.subscribe(
            (mutation, state) => {
                if(mutation.type == "dataset/setResource") {
                    if (mutation.payload.id === self.resource.id){
                        self.useResource = state.dataset.resources[self.resource.id];
                        unsub();
                    }
                }
            }
        )
        
    },

    data() {
        return {
            dialog: false,
            schemaDialog: false,
            editDialog: false,
            viewDialog: false,
            useResource: {metadata: this.resource},
        };
    }
};
</script>

<style scoped>

.container {
    padding-bottom: 15px;
}

div[role="listitem"]{
    padding-left: 5px;
    padding-right: 5px;
    width: 100%;
}

</style>
