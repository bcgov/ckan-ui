<template>
    <v-card hover style="margin-bottom:.5rem">
        <v-container fluid>
            <v-layout row wrap align-center fill-height>
                <v-flex xs12>
                    <h4>
                        <i class="fa fa-file"></i>
                        {{resource.name}}
                    </h4>
                    <span>
                        <strong>Type:</strong>
                        {{resource.format}}
                    </span>
                </v-flex>
            </v-layout>
            <v-layout row wrap align-center fill-height>
                <v-flex xs6>
                    <v-btn flat block color="secondary" :href="resource.url">
                        Download&nbsp;
                        <i class="fa fa-download float-right"></i>
                    </v-btn>
                </v-flex>
                <v-flex xs6>
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn flat block color="secondary" v-on="on">
                                More&nbsp;
                                <i class="fa fa-caret-down"></i>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-tile>
                                <v-dialog
                                    v-model="dialog"
                                    fullscreen
                                    style="z-index: 10000" 
                                    transition="dialog-bottom-transition"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-list-tile v-on="on">Preview</v-list-tile>
                                    </template>
                                    <Preview
                                        :resource="resource"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="dialog = false"
                                    ></Preview>
                                </v-dialog>
                            </v-list-tile>
                            <v-list-tile v-if="((resource.format.toLowerCase() === 'csv') || (resource.jsonSchema !== '' && typeof(resource.jsonSchema) !== 'undefined'))">
                                <v-dialog
                                    v-model="schemaDialog"
                                    fullscreen
                                    style="z-index: 10000" 
                                    
                                    transition="dialog-bottom-transition"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-list-tile v-on="on">View Schema (JSON Table Schema)</v-list-tile>
                                    </template>
                                    <JsonTable
                                        :resource="resource"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="schemaDialog = false"
                                    ></JsonTable>
                                </v-dialog>
                            </v-list-tile>
                            <v-list-tile v-if="showEdit">
                                <v-dialog
                                    v-model="viewDialog"
                                    fullscreen
                                    style="z-index: 10000" 
                                    
                                    transition="dialog-bottom-transition"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-list-tile v-on="on">View</v-list-tile>
                                    </template>
                                    <EditResource
                                        edit="false"
                                        :resource="resource"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="editDialog = false"
                                    ></EditResource>
                                </v-dialog>
                            </v-list-tile>
                            <v-list-tile v-if="showEdit">
                                <v-dialog
                                    v-model="editDialog"
                                    fullscreen
                                    style="z-index: 10000" 
                                    
                                    transition="dialog-bottom-transition"
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-list-tile v-on="on">Edit</v-list-tile>
                                    </template>
                                    <EditResource
                                        edit="true"
                                        :resource="resource"
                                        :resourceIndex="resourceIndex"
                                        v-on:closePreviewDialog="editDialog = false"
                                    ></EditResource>
                                </v-dialog>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </v-flex>
            </v-layout>
        </v-container>
    </v-card>
</template>

<script>
import Preview from "../resources/preview";
import JsonTable from "../resources/jsontable";
import EditResource from "../resources/edit";

export default {
    props: {
        resource: Object,
        resourceIndex: Number,
        showEdit: Boolean,
    },
    components: {
        Preview: Preview,
        JsonTable: JsonTable,
        EditResource: EditResource
    },
    methods: {},
    data() {
        return {
            dialog: false,
            schemaDialog: false,
            editDialog: false,
        };
    }
};
</script>

<style scoped>

.container {
    padding-bottom: 15px;
}
</style>
