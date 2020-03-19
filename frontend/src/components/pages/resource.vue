<template>
    <v-container v-if="dataLoading || schemaLoading" fluid>
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="datasetError" fluid>
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{datasetError.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else grid-list-md class="main-area">
        <v-alert
            :value="resource.state === 'deleted'"
            type="warning">
            You are viewing a deleted resource
        </v-alert>
        <v-alert
            :value="showFormSuccess"
            class="fixed"
            dismissible
            type="success">
            {{formSuccess}}
        </v-alert>
        <v-alert
            :value="showFormError"
            class="fixed"
            dismissible
            type="error">
            {{formError}}
        </v-alert>

        <!-- <powButton :dataset="dataset"/> -->
        <v-row align-content="start">
            <v-btn left text color="primary" class="ml-5" :to="{ name: 'dataset_view', params: { datasetId: dataset.name } }"><v-icon>mdi-arrow-left</v-icon>Back to Dataset</v-btn>
        </v-row>

        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-row fill-height>
                    <v-col cols=12 md=8 v-if="!!schema">
                        <v-toolbar color="secondary">
                            <v-toolbar-title color="white">Resource Details</v-toolbar-title>
                        </v-toolbar>
                        <DynamicForm
                            :schema="schema.resource_fields"
                            :textFields="textFields"
                            :editing="editing"
                            :values="resource"
                            :disabled="disabled"
                            ref="dynoForm"
                            @updated="(field, value) => updateResource(field, value)"
                        >
                        </DynamicForm>
                    </v-col>
                    <v-col cols=12 md=4>
                        <v-toolbar color="secondary">
                            <v-toolbar-title>Access</v-toolbar-title>
                        </v-toolbar>
                        <v-container v-if="resource">
                            <v-row v-if="loadPOW">
                                <v-col cols=12>
                                    <powButton :resource="resource" btn/>
                                </v-col>
                            </v-row>
                            <v-row v-else>
                                <v-col cols=12>
                                    <v-btn block color="primary" :href="resource.url"><v-icon>mdi-cloud-download-outline</v-icon>Download</v-btn>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols=12>
                                    <v-btn block color="primary" @click.stop="previewDialog = true">
                                        <v-icon>mdi-scan-helper</v-icon>Preview
                                        <v-dialog
                                            eager
                                            v-model="previewDialog"
                                            fullscreen
                                            transition="dialog-bottom-transition"
                                        >
                                            <Preview
                                                :resource="resource"
                                                v-on:closePreviewDialog="previewDialog = false"
                                            ></Preview>
                                        </v-dialog>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <v-row v-if="!!resource.hasSchema">
                                <v-col cols=12>
                                    <v-btn block color="primary" @click.stop="schemaDialog = true">
                                        <v-icon>mdi-code-json</v-icon>View Schema (JSON Table Schema)
                                        <v-dialog
                                            eager
                                            v-model="schemaDialog"
                                            fullscreen
                                            transition="dialog-bottom-transition"
                                        >
                                            <JsonTable
                                                :resource="resource"
                                                v-on:closePreviewDialog="schemaDialog = false"
                                            ></JsonTable>
                                        </v-dialog>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-toolbar color="secondary">
                            <v-toolbar-title>Resources</v-toolbar-title>
                        </v-toolbar>
                        <ResourceList :createMode="createMode" :showEdit="showEdit" :datasetBeingEdited="editing" :resources="siblings(resource.id)"></ResourceList>
                        <v-row wrap v-if="!createMode">
                            <v-col cols=12>
                                <v-btn text small color="secondary" v-clipboard="() => permalink">{{$tc("Permalink")}}</v-btn>
                            </v-col>
                        </v-row>
                        <v-row wrap v-if="!createMode && showEdit">
                            <v-col cols=12>
                                <v-btn text color="primary" @click="toggleEdit">{{$tc("Edit Resource")}}</v-btn>
                                <br>
                                <v-btn text color="error" @click="deleteDataset">{{$tc("Delete Resource")}}</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </ValidationObserver>
    </v-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { ValidationObserver } from "vee-validate";
import ResourceList from "../dataset/ResourceList";

import {Analytics} from '../../services/analytics';
const analyticsServ = new Analytics()

import {CkanApi} from '../../services/ckanApi';
const ckanServ = new CkanApi();

import DynamicForm from '../form/DynamicForm';
import Preview from "../resources/preview";
import JsonTable from "../resources/jsontable";
import powButton from "../pow/powButton";

export default {
    components: {
        DynamicForm: DynamicForm,
        ResourceList: ResourceList,
        ValidationObserver: ValidationObserver,
        Preview: Preview,
        JsonTable: JsonTable,
        powButton: powButton
    },
    data() {
        let schemaName = 'bcdc_dataset';
        return {
            editing: this.$route.name === "resource_create",
            formError: '',
            showFormError: false,
            formSuccess: '',
            showFormSuccess: false,
            schemaName: schemaName,
            disabled: false,
            schema: this.$store.state.dataset.schemas[schemaName] ? this.$store.state.dataset.schemas[schemaName] : {},
            createMode: this.$route.name === "resource_create",
            textFields: ['name', 'object_name', 'object_short_name', 'object_table_comments'],
            error: this.datasetError,
            previewDialog: false,
            schemaDialog: false
        };
    },
    // watch: {
    //     getAbort(newVal) {
    //         if(newVal==true) {
    //             this.$router.push('/datasets');
    //         }
    //     },
    // },
    computed: {
        loadPOW: function() {
            return (this.resource.bcdc_type=="geographic" && ("object_name" in this.resource) && this.resource.name.toLowerCase().indexOf("custom download") !== -1);
        },

        nonSchemaFields: function() {
            let keys = Object.keys(this.dataset);
            // let remove = ['id', 'type', 'num_tags', 'num_resources', 'license_title', 'license_url'];
            // for (var i=0; i<this.schema.resource_fields.length; i++){
            //     remove.push(this.schema.resource_fields[i].field_name);
            //     if (typeof(this.schema.resource_fields[i].subfields) !== "undefined"){
            //         for (var j=0; j<this.schema.resource_fields[i].subfields.length; j++){
            //             remove.push(this.schema.resource_fields[i].subfields[j].field_name);
            //         }
            //     }
            // }
            // keys = keys.filter(function(el){
            //     return remove.indexOf(el) < 0;
            // });
            keys.sort();
            return keys;
        },

        // getAbort() {
        //     return this.$store.state.dataset.shouldAbort;
        // },
        permalink: function(){
            return window.location.origin+'/dataset/'+this.dataset.id+'/resource/'+this.resource.id
        },

        // schema: function () {
        //     return this.$store.state.dataset.schemas[this.schemaName];
        // },

        datasetId: function datasetId() {
            return this.$route.params.datasetId;
        },
        resourceId: function resourceId() {
            return this.$route.params.resourceId;
        },
        // editLink: function editLink() {
        //     return "/dataset/" + this.datasetId + "/edit";
        // },

        ...mapState({
            dataset: state => state.dataset.dataset,
            resource: state => state.dataset.resource,
            shouldAbort: state => state.dataset.shouldAbort,
            userPermissions: state => state.user.userPermissions,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
            dataLoading: state => state.dataset.dataLoading,
            schemaLoading: state => state.dataset.schemaLoading,
            userLoading: state => state.user.loading,
            schemas: state => state.dataset.schemas,
            userOrgs: state => state.organization.userOrgs,
            datasetError: state => state.dataset.error
        }),

        ...mapGetters("dataset", {
            siblings: "getResourceList"
        }),

        showEdit: function(){
            // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
            //return ( (!this.editing) && ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));
            if (!this.dataset.organization){
                return ( (!this.dataLoading) && (!this.schemaLoading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin)) );
            }
            return ( (!this.dataLoading) && (!this.schemaLoading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.userPermissions[this.dataset.organization.name] === "editor")));
        },
    },

    methods: {
        // getUserOrgs() {
        //     if (this.userOrgs.length <= 0){
        //         this.$store.dispatch("organization/getUserOrgs");
        //     }
        // },
        getResource() {
            let self = this;
            let unsub = this.$store.subscribe(
                (mutation, state) => {
                    if(mutation.type == "dataset/setSchema") {
                        self.schema = state.dataset.schemas[self.schemaName];
                        unsub();
                        //this.$router.push('/datasets');
                    }
                }
            )
            if ((!this.createMode) && ((this.dataLoading) && (this.schemaLoading)) || (typeof(this.datasetId) !== "undefined")) {
                this.$store.dispatch("dataset/getResource", { id: this.resourceId }) // .then(() => {
                //     this.schema = this.$store.state.dataset.schemas[this.schemaName]
                // });
            }
            this.$store.dispatch('dataset/getDatasetSchema').then(() => {
                this.$store.commit('dataset/setSchemaLoading', {schemaLoading: false});
            });
            //this.$router.push('/datasets');
        },
        toggleEdit() {
            this.editing = !this.editing;
            this.formError = '';
            this.showFormError = false;
            this.formSuccess = '';
            this.showFormSuccess = false;
        },
        async deleteResource(){
            const response = await ckanServ.deleteResource(this.resourceId);

            this.formSuccess = "";
            this.formError = "";

            if (response.success && response.success === true && (!response.error || response.error === false)){
                this.formSuccess = "Successfully deleted";
                this.showFormSuccess = true;
                this.showFormError = false;
                return;
            }else if (response.error){
                this.formError = response.error;
                this.showFormSuccess = false;
                this.showFormError = true;
                return;
            }
            this.formError = "Unknown error deleting resource";
            this.showFormSuccess = false;
            this.showFormError = true;
        },
        cancel(){
            if (this.createMode){
                this.$router.push('/dataset/' + this.datasetId);
            }

            this.$store.commit("dataset/resetResource");
            this.toggleEdit();
        },

        nothing(){
        },

        async submit(){
            this.disabled = true;
            const isValid = await this.$refs.observer.validate();

            if (!isValid){
                this.formError = "Please fix the fields in error before submitting";
                this.showFormError = true;
                this.showFormSuccess = false;
                this.disabled = false;
                return;
            }

            let result = {};
            if (this.createMode){
                result = await this.$store.dispatch("dataset/createResource")
            }else{
                result = await this.$store.dispatch("dataset/setResource");
            }
            if (!result || !result.success || result.success === false){
                if (result.error.message){
                    this.formError = result.error.message;
                }else if (result.error.type && result.error.type[0]){
                    this.formError = result.error.type[0];
                }else if (result.error){
                    this.formError = result.error;
                }else{
                    this.formError = "Unknown Error";
                }
                this.showFormError = true;
                this.showFormSuccess = false;
            }else{
                this.$router.push('/dataset/' + this.datasetId);
                this.formSuccess = "Successfully updated";
                this.showFormSuccess = true;
                this.showFormError = false;
            }
            this.disabled = false;
        },
        updateResource(field, newValue){
            this.resource[field] = newValue;
            this.$store.commit('dataset/setCurrentNotUnmodResource', { resource: this.resource } );
        },
    },

    mounted (){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        // this.getUserOrgs();
        // this.$store.dispatch("organization/getOrgs");
        this.getResource();
    },

};
</script>

<style>
h1,
h2,
h3,
h4,
h5 {
    color: #444444;
}
</style>

<style scoped>
.fixed{
    position: fixed;
    z-index: 50;
}
.main-area {
    margin-top: 20px;
    margin-bottom: 45px;
}
ul {
    list-style-type: none;
}
.tracking-summary {
    height: inherit;
    padding: inherit;
}
.metadata {
    padding-top: 0px;
    padding-left: 0px;
}
.button-container{
    position: fixed;
    bottom: 50px;
    right: 0;
    z-index: 10;
}

.v-btn{
    margin-right: 5px;
}
.v-toolbar__title{
    color: var(--v-text-base)
}
</style>
