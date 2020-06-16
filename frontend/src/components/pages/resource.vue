<template>
    <v-container v-if="dataLoading || schemaLoading" fluid class="main-area">
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="datasetError" fluid class="main-area">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{datasetError.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid grid-list-md class="main-area">
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
        <v-row>
            <v-col cols=12 class="ml-2">
                <router-link :to="{ name: 'dataset_view', params: { datasetId: dataset.name } }" class="nounderline"><v-icon color="primary">mdi-arrow-left</v-icon> {{$tc('Back to')}} {{$tc('Datasets', 1)}}</router-link>
            </v-col>
        </v-row>

        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-row fill-height>
                    <v-col cols=11 md=7 v-if="!!schema">
                        <v-container class="py-0">
                            <v-row class="header-bar mb-0 mr-0" align-content="center">
                                <v-col cols=12>
                                    <h4 class="color-text">{{$tc('Resource Details', 1)}}</h4>
                                </v-col>
                            </v-row>
                            <v-row v-if="editing">
                                <v-col cols=12>
                                    <v-btn depressed class="float-right ctrl-button preview-button" @click="cancel">Cancel</v-btn>
                                    <v-btn depressed color="primary" class="float-right ctrl-button" type="submit" @click="submit()">Save</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
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
                        <v-row v-if="editing">
                            <v-col cols=12>
                                <v-btn depressed class="float-right ctrl-button preview-button" @click="cancel">Cancel</v-btn>
                                <v-btn depressed color="primary" class="float-right ctrl-button" type="submit" @click="submit()">Save</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols=1 sm=1></v-col>
                    <v-col cols=4 class="d-none d-sm-block pr-0">
                        <v-row class="header-bar mb-0 mr-0" align-content="center">
                            <v-col cols=12>
                                <h4 class="color-text">{{$tc('Access', 1)}}</h4>
                            </v-col>
                        </v-row>
                        <v-row class="fullWidth mr-0" v-if="resource && loadPOW">
                            <v-col cols=12 class="px-0 pb-0">
                                <powButton :resource="resource" btn/>
                            </v-col>
                        </v-row>
                        <v-row class="fullWidth mr-0" v-else-if="resource">
                            <v-col cols=12 class="px-0 pb-0">
                                <v-btn depressed block color="primary" :href="resource.url" class="ctrl-button">
                                    <v-icon>mdi-cloud-download-outline</v-icon>&nbsp;Download
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row class="fullWidth mr-0">
                            <v-col cols=12 class="px-0">
                                <v-btn depressed block color="text" @click.stop="previewDialog = true" class="ctrl-button preview-button">
                                    <v-icon>mdi-fullscreen</v-icon>&nbsp;Preview
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
                                <v-btn depressed block color="primary" @click.stop="schemaDialog = true" class="ctrl-button">
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
                        <v-row class="header-bar mb-0 mr-0" align-content="center">
                            <v-col cols=12>
                                <h4 class="color-text">{{$tc('Other Resources', 1)}}</h4>
                            </v-col>
                        </v-row>
                        <v-row class="fullWidth mr-0">
                            <v-col cols=12 class="px-0 py-0 my-n2">
                                <ResourceList :createMode="createMode" :showEdit="showEdit" :datasetBeingEdited="editing" :resources="siblings(resource.id)"></ResourceList>
                            </v-col>
                        </v-row>
                        <v-row wrap v-if="!createMode">
                            <v-col cols=12 class="pl-0">
                                <v-btn text small color="label_colour" class="lower-button mx-0 px-0" v-clipboard="() => permalink" @click="snackbar = true">
                                    <v-icon>mdi-content-copy</v-icon>&nbsp;{{$tc("Copy Permalink")}}
                                </v-btn>
                                <v-snackbar v-model="snackbar" :timeout=2000><span class="mx-auto">Copied to Clipboard!</span></v-snackbar>
                            </v-col>
                        </v-row>
                        <v-row wrap v-if="!createMode && showEdit">
                            <v-col cols=12 class="pl-0">
                                <v-btn text color="label_colour" class="lower-button mx-0 px-0" @click="toggleEdit">
                                    <v-icon>mdi-pencil-outline</v-icon>&nbsp;{{$tc("Edit Resource")}}
                                </v-btn>
                                <br>
                                <v-btn text color="error_text" class="lower-button mx-0 px-0" @click="deleteResource">
                                    <v-icon>mdi-trash-can-outline</v-icon>&nbsp;{{$tc("Delete Resource")}}
                                </v-btn>
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
            schemaDialog: false,
            snackbar: false
        };
    },
    watch: {
    //     getAbort(newVal) {
    //         if(newVal==true) {
    //             this.$router.push('/datasets');
    //         }
    //     },

        datasetId(newVal){
            this.resource['package_id'] = newVal;
            this.$store.commit('dataset/setCurrentNotUnmodResource', { resource: this.resource } );
        }
    },
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
            return this.$route.params.resourceId || null;
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
            dataLoading: state => state.dataset.resourceLoading,
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
            );
            if (this.createMode) {
                this.$store.dispatch("dataset/newResource");
            }
            if (!this.createMode && (typeof(this.resource) === 'undefined' || !this.resource.id)) {
                this.$store.dispatch("dataset/getResource", { id: this.resourceId });
            }
            this.$store.dispatch('dataset/getDatasetSchema').then(() => {
                this.$store.commit('dataset/setSchemaLoading', {schemaLoading: false});
            });
        },
        getDataset() {
            if ((!this.dataset) || (typeof(this.datasetId) !== "undefined")) {
                this.$store.dispatch("dataset/getDataset", { id: this.datasetId }).then(() => {
                    this.schema = this.$store.state.dataset.schemas[this.schemaName]
                });
            }
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

            if (!this.resource['package_id']) {
                this.resource['package_id'] = this.datasetId;
            }

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
        this.getDataset();
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
}
.rightZero{
    right: 0;
}
.nounderline{
    text-decoration: none;
    font-size: 16px;
    color: var(--v-label_colour-base);
}
.main-area {
    margin-bottom: 45px;
    background: var(--v-data_background-base);
    padding-left: 68px;
    padding-right: 56px;
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
.title {
    font-size: 16px;
    font-weight: bold;
    color: var(--v-menu_secondary-base);
}
.v-btn{
    margin-right: 5px;
}
.color-text {
    color: var(--v-text-base);
}
.ctrl-button {
    font-size: 16px;
    font-weight: bold;
    height: 40px !important;
}
.preview-button {
    border-style: solid !important;
    border-color: var(--v-primary-base) !important;
    border-width: 2px !important;
    color: var(--v-primary-base);
}
.lower-button {
    font-size: 16px;;
}
.header-bar {
    width: 100%;
    background-color: var(--v-menu_secondary-base);
    color: var(--v-text-base);
    height: 40px;
}
.fullWidth{
    width: 100%;
}
</style>
