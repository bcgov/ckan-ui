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
    <v-container v-else fluid grid-list-md class="main-area" :key="'resourceCRUD-'+redrawIndex">
        <Banner></Banner>
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

                <v-btn text small depressed color="primary" v-if="!editing"  v-scroll-to="{
                    el: '#endOfForm',
                    x: false,
                    y: true
                }">
                    <v-icon>mdi-format-vertical-align-bottom</v-icon>
                    {{$tc('Scroll to Bottom')}}
                </v-btn>

                <v-btn text small depressed color="primary" v-if="!editing" @click="mailLink">
                    <v-icon>mdi-email-outline</v-icon>
                    {{$tc('Contact Data Expert')}}
                </v-btn>

                <v-btn v-if="!editing" small depressed text color="primary" v-clipboard="() => permalink" @click="snackbar = true">
                    <v-icon>mdi-share-variant</v-icon>&nbsp;{{$tc("Copy Permalink")}}
                </v-btn>

                <v-btn v-if="!editing" small depressed text :disabled="previewLoading || !canPreview" color="primary" @click.stop="previewDialog = true">
                    <v-icon v-if="!previewLoading">mdi-fullscreen</v-icon>
                    <v-progress-circular v-else :size="20" :width="2" color="grey" indeterminate></v-progress-circular>
                    &nbsp;{{$tc('Preview')}}
                    <v-dialog
                        eager
                        v-model="previewDialog"
                        fullscreen
                        transition="dialog-bottom-transition"
                    >
                        <Preview
                            :resource="resource"
                            :preview="preview"
                            v-on:closePreviewDialog="previewDialog = false"
                        ></Preview>
                    </v-dialog>
                </v-btn>

                <powButton :dataset="dataset" :resource="resource" v-if="!editing && resource && loadPOW" btn icon/>

                <v-btn v-if="!!preview.hasSchema && !editing" :disabled="previewLoading" depressed small text color="primary" @click.stop="schemaDialog = true">
                    <v-icon v-if="!previewLoading">mdi-code-braces</v-icon>
                    <v-progress-circular v-else :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
                    {{$tc('View Schema (JSON Table Schema)')}}
                    <v-dialog
                        eager
                        v-model="schemaDialog"
                        fullscreen
                        transition="dialog-bottom-transition"
                    >
                        <JsonTable
                            :resource="resource"
                            :preview="preview"
                            v-on:closePreviewDialog="schemaDialog = false"
                        ></JsonTable>
                    </v-dialog>
                </v-btn>

                <v-btn v-if="!editing && !loadPOW" small depressed text color="primary" :href="resource.url">
                    <v-icon>mdi-open-in-new</v-icon>&nbsp;{{$tc('Access/Download')}}
                </v-btn>

                <v-btn v-if="!editing && showEdit" small depressed text color="primary" :to="{ name: 'resource_create', params: { datasetId: dataset.name }}">
                    <v-icon>mdi-plus</v-icon>&nbsp;{{$tc("Add Resource")}}
                </v-btn>

                <v-btn v-if="!editing && showEdit" small depressed text color="primary"
                    :to="{ name: 'resource_view', query: { editing: true }, params: { datasetId: dataset.name, resourceId: resource.id }}">
                    <v-icon>mdi-pencil-outline</v-icon>&nbsp;{{$tc("Edit Resource")}}
                </v-btn>

                <DeleteButton
                        v-if="showResourceDeleteButton"
                        buttonText="Delete Resource"
                        confirmationMessage="Are you sure you want to delete this resource?"
                        @delete="deleteResource">
                </DeleteButton>
                
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
                            :loggedIn="loggedIn"
                            :disabled="disabled"
                            :exclude="excludedFields"
                            :excludeFromView="['preview_info']"
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
                                <ResourceList :canDelete="showResourceDeleteButton" :createMode="createMode" :showEdit="showEdit" :datasetBeingEdited="editing" :resources="siblings(resource.id)"></ResourceList>
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
import DeleteButton from '../DeleteButton';
import Banner from '../banner/Banner'

import Permissions from '@/mixins/permissions';

export default {
    mixins: [Permissions],
    components: {
        DynamicForm: DynamicForm,
        ResourceList: ResourceList,
        ValidationObserver: ValidationObserver,
        Preview: Preview,
        JsonTable: JsonTable,
        powButton: powButton,
        DeleteButton,
        Banner: Banner
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
            textFields: ['name', 'object_name', 'object_short_name', 'object_table_comments', 'last_modified'],
            error: this.datasetError,
            previewDialog: false,
            schemaDialog: false,
            snackbar: false,
            notAtTop: false,
            redrawIndex: 0
        };
    },
    beforeRouteUpdate(to, from, next) {
        this.getResource(to.params.resourceId);
        next();
    },
    watch: {
        datasetId(newVal){
            this.resource['package_id'] = newVal;
            this.$store.commit('dataset/setCurrentNotUnmodResource', { resource: this.resource } );
        },

        $route(to) {
            this.redrawIndex++;
            this.editing = ( to.name === "resource_create" || (to.query && to.query.editing) ),
            this.createMode = (to.name === "resource_create");
            if (this.createMode) {
                this.$store.dispatch("dataset/newResource");
            } else{
                this.$store.dispatch("dataset/getResource", { id: this.resourceId });
            }
        },
    },

    computed: {

        canPreview() {
            return (this.preview.headers && this.preview.headers.length>0) ||
                   (this.preview['content-type'] && this.preview['content-type'].indexOf('image/')===0) ||
                   this.preview.format === 'openapi-json' ||
                   this.preview.type === 'pdf' ||
                   (this.resource.metadata &&
                    this.resource.metadata.preview_info);
        },


        loadPOW: function() {
            return (this.resource.bcdc_type=="geographic" && ("object_name" in this.resource) && this.resource.name.toLowerCase().indexOf("custom download") !== -1);
        },


        excludedFields: function() {
            if (this.loadPOW && !this.editing) {
                return ["url"]; // hide the URL field for the non-edit screen of OFI resources
            } else {
                return [];
            }
        },

        nonSchemaFields: function() {
            let keys = Object.keys(this.dataset);
            keys.sort();
            return keys;
        },

        permalink: function(){
            return window.location.origin+'/dataset/'+this.dataset.id+'/resource/'+this.resource.id
        },

        datasetId: function datasetId() {
            return this.$route.params.datasetId;
        },

        resourceId: function resourceId() {
            return this.$route.params.resourceId || null;
        },

        ...mapState({
            dataset: state => state.dataset.dataset,
            resource: state => {
                if (state.dataset && state.dataset.dataset && state.dataset.resource && state.dataset.dataset.title && state.dataset.resource.name) {
                    window.document.title = state.dataset.dataset.title + " - " + state.dataset.resource.name + " - Data Catalogue";
                }
                return state.dataset.resource;
            },
            shouldAbort: state => state.dataset.shouldAbort,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
            dataLoading: state => state.dataset.resourceLoading,
            schemaLoading: state => state.dataset.schemaLoading,
            userLoading: state => state.user.loading,
            schemas: state => state.dataset.schemas,
            userOrgs: state => state.organization.userOrgs,
            datasetError: state => state.dataset.error,
            loggedIn: state => state.user.loggedIn,
            organizations: state => state.organization.orgList,
            previewLoading: state => state.dataset.previewLoading,
            preview: state => state.dataset.preview,
            previewError: state => state.dataset.previewError,
        }),

        ...mapGetters("dataset", {
            siblings: "getResourceList",
        }),
        ...mapGetters("organization", {
            ancestorsByName: "ancestorsByName",
        }),

        canDeleteResources: function(){
            if (!this.dataset.organization){
                return false;
            }
            let {sysAdmin, admin, editor} = this.getUserPermissionsForOrganization(this.dataset.organization.name);
            return sysAdmin || admin || editor;
        },

    },

    methods: {
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
                    }
                }
            );
            if (this.createMode) {
                this.$store.dispatch("dataset/newResource");
            } else {
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
        catchScroll() {
            this.notAtTop = false;
            if (window.pageYOffset > 50){
                this.notAtTop = true;
            }
        },
        async deleteResource() {
            const response = await ckanServ.deleteResource(this.resourceId);

            this.formSuccess = "";
            this.formError = "";

            if (response.success && response.success === true && (!response.error || response.error === false)){
                this.formSuccess = "Successfully deleted";
                this.showFormSuccess = true;
                this.showFormError = false;
                return;
            } else if (response.error){
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
            } else {
                this.$router.push({
                    name: 'resource_view',
                    params: {
                        datasetId: this.dataset.name,
                        resourceId: this.resource.id
                    }
                });
            }
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

        mailLink(){
            let link="mailto:"
            let c = null;
            if (this.dataset && this.dataset.contacts){
                c = this.dataset.contacts;
                if (typeof(c) === "string"){
                    c = JSON.parse(c);
                }

                let setC = false;
                for (let i=0; i<c.length; i++){
                    if ( (c[i].displayed) || (c[i].private && c[i].private.toLowerCase() === "display") ){
                        c = c[i];
                        setC = true;
                        break;
                    }
                }

                if (!setC){
                    return ''
                }
                
                link += c.email
            }else{
                return '';
            }
            link += '?subject=Questions about '+this.dataset.title
            link += '&body='
            link += "Hi "+c.name+",%0D%0A%0D%0A";
            link += "Re: "+this.dataset.title+" "+this.permalink+"%0D%0A";
            link += "%0D%0A%0D%0A(Please introduce yourself)%0D%0A",
            link += "Hi! My name is ... and I am a ...%0D%0A";
            link += "%0D%0A%0D%0A(Please describe what you want to accomplish)%0D%0A";
            link += "I was hoping to find information about ...%0D%0A";
            link += "%0D%0A%0D%0A(Please add any other questions for the data provider)%0D%0A";
            link += "Is there someone I can contact to find out more about ....%0D%0A"

            this.$gtag.event('Resource Mailto', {
                'event_category': 'Link click',
                'event_label': 'Mailto'
            })

            window.open(link, "_blank");
        },
    },

    mounted (){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getDataset();
        this.getResource();
        window.addEventListener('scroll', this.catchScroll)
    },
    updated() {
        window.snowplow('refreshLinkClickTracking');
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
    min-height: calc(100% - 115px);
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
