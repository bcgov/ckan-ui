<template>
    <v-container v-if="dataLoading || schemaLoading" fluid class="main-area">
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="datasetError" fluid class="main-area">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{datasetError.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid grid-list-md class="main-area">
        <v-row id="topOfResForm"></v-row>
        <v-row class="mt-0 py-4 wrap px-md-15 fauxbar">
            <v-col cols=10 class="my-0 py-0" v-if="showFormError || showFormSuccess || resource.state === 'deleted'">
                <v-alert
                    :value="resource.state === 'deleted'"
                    type="warning">
                    You are viewing a deleted resource
                </v-alert>
                <v-alert
                    :value="showFormSuccess"
                    @input="showFormSuccess = false;"
                    dismissible
                    type="success">
                    {{formSuccess}}
                </v-alert>
                <v-alert
                    :value="showFormError"
                    @input="showFormError = false;"
                    dismissible
                    type="error">
                    {{formError}}
                </v-alert>
            </v-col>
            <v-col cols=12>
                <v-btn v-if="!editing" small depressed text :to="{ name: 'dataset_view', params: { datasetId: dataset.name } }" color="primary">
                    <v-icon color="primary">mdi-arrow-left</v-icon> 
                    {{$tc('Back to')}} {{$tc('Datasets', 1)}}
                </v-btn>
                <v-btn v-if="!editing" small depressed text color="primary" :href="resource.url">
                    <v-icon>mdi-download</v-icon>&nbsp;{{$tc('Download')}}
                </v-btn>
                <v-btn v-if="!editing" small depressed text color="primary" @click.stop="previewDialog = true">
                    <v-icon>mdi-fullscreen</v-icon>&nbsp;{{$tc('Preview')}}
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
                <v-btn v-if="!editing" small depressed text color="primary" v-clipboard="() => permalink" @click="snackbar = true">
                    <v-icon>mdi-share-variant</v-icon>&nbsp;{{$tc("Copy Permalink")}}
                </v-btn>

                <powButton :resource="resource" v-if="!editing && resource && loadPOW" btn/>

                <v-btn v-if="!!resource.hasSchema" depressed block color="primary" @click.stop="schemaDialog = true" class="ctrl-button">
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

                <v-btn text small depressed color="primary" v-if="!editing"  v-scroll-to="{
                    el: '#endOfForm',
                    x: false,
                    y: true
                }">
                    <v-icon>mdi-format-vertical-align-bottom</v-icon>
                    {{$tc('Scroll to Bottom')}}
                </v-btn>

                <v-btn v-if="!editing && showEdit" small depressed text color="primary" @click="toggleEdit">
                    <v-icon>mdi-pencil-outline</v-icon>&nbsp;{{$tc("Edit Resource")}}
                </v-btn>
                
                <v-btn v-if="!editing && canDeleteResources" small depressed text color="error_text" @click="deleteResource">
                    <v-icon>mdi-trash-can-outline</v-icon>&nbsp;{{$tc("Delete Resource")}}
                </v-btn>
                
                <v-btn v-if="editing" depressed @click="cancel">Cancel</v-btn>
                <v-btn v-if="editing" depressed color="primary" type="submit" @click="submit()">Save</v-btn>
            </v-col>
        </v-row>
        
        <v-snackbar v-model="snackbar" style="position: absolute;" :timeout=2000><span class="mx-auto permalink">{{$tc('Share link copied')}}</span></v-snackbar>

        <v-row class="mt-12 mb-12" v-if="showFormError || showFormSuccess || resource.state === 'deleted'"></v-row>

        <v-row class="mb-9"></v-row>

        <v-row class="workingSpinner" v-if="disabled">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-row>

        <!-- <powButton :dataset="dataset"/> -->

        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-row fill-height class="pt-5">
                    <v-col cols=11 :md="(resource.id && siblings(resource.id) && siblings(resource.id).length>0) ? 7 : 11" v-if="!!schema">
                        <v-container>
                            <v-row>
                                <v-col cols=12>
                                    <h4 class="mt-5">{{dataset.title}}</h4>
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
                        <v-row id="endOfForm" class="mx-0 py-0"></v-row> 
                    </v-col>
                    <v-col cols=1 sm=1></v-col>
                    <v-col cols=4 class="d-none d-sm-block pr-0" v-if="!editing && resource.id && siblings(resource.id) && siblings(resource.id).length>0">
                        <v-row class="mb-4">
                        </v-row>
                        <v-row class="header-bar mb-0 mr-0" align-content="center">
                            <v-col cols=12>
                                <h4 class="color-text pb-1">{{$tc('Other Resources', 1)}}</h4>
                            </v-col>
                        </v-row>
                        <v-row class="fullWidth mt-0 pt-0 mr-0">
                            <v-col cols=12 class="px-0 py-0 my-n2">
                                <ResourceList :createMode="createMode" :showEdit="showEdit" :datasetBeingEdited="editing" :resources="siblings(resource.id)"></ResourceList>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </ValidationObserver>
        <v-row>
            <v-btn small v-if="notAtTop" depressed color="primary" class="scrollTop" v-scroll-to="{
                el: '#topOfResForm',
                x: false,
                y: true
            }">
                <v-icon>mdi-format-vertical-align-top</v-icon>
                {{$tc('Scroll to Top')}}
            </v-btn>
        </v-row>
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
            editing: ( this.$route.name === "resource_create" || (this.$route.query && this.$route.query.editing) ),
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
            snackbar: false,
            notAtTop: false,
        };
    },
    beforeRouteUpdate(to, from, next) {
        this.getResource(to.params.resourceId);
        next();
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

        canDeleteResources: function(){
            if (!this.dataset.organization){
                return false;
            }
            return ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor"))
        },

    },

    methods: {
        // getUserOrgs() {
        //     if (this.userOrgs.length <= 0){
        //         this.$store.dispatch("organization/getUserOrgs");
        //     }
        // },
        getResource(id) {
            if (typeof(id) === "undefined"){
                id = this.resourceId;
            }
            this.$store.commit("dataset/clearResource");
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
            if (!this.createMode) {
                this.$store.dispatch("dataset/getResource", { id: id });
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
        catchScroll() {
            this.notAtTop = false;
            if (window.pageYOffset > 50){
                this.notAtTop = true;
            }
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
                try{
                    result = await this.$store.dispatch("dataset/createResource")
                }catch(ex){
                    this.formError = "Unknown Error";
                    this.showFormError = true;
                    this.showFormSuccess = false;
                    this.disabled = false;
                    return;
                }
            }else{
                try{
                    result = await this.$store.dispatch("dataset/setResource");
                }catch(ex){
                    this.formError = "Unknown Error";
                    this.showFormError = true;
                    this.showFormSuccess = false;
                    this.disabled = false;
                    return;
                }
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

            if (field === "bcdc_type"){
                let geoExtent = this.resource['geographic_extent'];
            
                if (!geoExtent || !geoExtent['north_bound_latitude']){
                    if (!geoExtent){
                        geoExtent = {};
                    }
                    geoExtent.north_bound_latitude = "60.0";
                }

                if (!geoExtent['east_bound_longitude']){
                    geoExtent.east_bound_longitude = "-113.5";
                }

                if (!geoExtent['south_bound_latitude']){
                    geoExtent.south_bound_latitude = "48.0";
                }

                if (!geoExtent['west_bound_longitude']){
                    geoExtent.west_bound_longitude = "-139.5";
                }
                this.resource['geographic_extent'] = geoExtent;
            }

            this.$store.commit('dataset/setCurrentNotUnmodResource', { resource: this.resource } );
        },
    },

    mounted (){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getDataset();
        this.getResource();
        window.addEventListener('scroll', this.catchScroll)
    },
    destroyed () {
        window.removeEventListener('scroll', this.catchScroll)
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
.alertBar{
    position: absolute;
    z-index: 10;
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
.permalink{
    font-size: 16px;
    font-weight: bold;
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
    height: 50px;
}
.fullWidth{
    width: 100%;
}

.fauxbar{
    position: fixed;
    top: 65px;
    background-color: var(--v-data_background-base);
    z-index: 5;
    left: 0px;
    right: 0px;
}

.scrollTop{
    position: fixed;
    bottom: 55px; 
    right: 10px;
}

.theme--light.v-btn--active:before, .theme--light.v-btn--active:hover:before, .theme--light.v-btn:focus:before{
    opacity: 0;
}

.workingSpinner{
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -35px;
    margin-top: 35px;
}

</style>
