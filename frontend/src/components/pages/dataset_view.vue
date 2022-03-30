<template>
    <v-container v-if="dataLoading || schemaLoading" fluid class="main-area">
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="( (typeof(datasetError)==='string') && (datasetError.toLowerCase()) ) === 'not found'" fluid class="main-area">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> 404 Not Found: No such dataset</h1>
        </div>
    </v-container>
    <v-container v-else-if="datasetError" fluid class="main-area">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{datasetError.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid grid-list-md class="main-area" :key="'datasetCRUD-'+redrawIndex">
        <v-row id="topOfForm"></v-row>
        <v-row wrap class="mt-0 px-md-15 py-4 fauxbar">
            <v-col cols=10 v-if="showFormError || showFormSuccess || dataset.state === 'deleted'">
                <v-alert
                    :value="dataset.state === 'deleted'"
                    class="mb-0"
                    type="warning">
                    You are viewing a deleted dataset
                </v-alert>
                <v-alert
                    v-model="showFormSuccess"
                    dismissible
                    class="mb-0"
                    type="success">
                    {{formSuccess}}
                </v-alert>
                <v-alert
                    v-model="showFormError"
                    dismissible
                    class="mb-0"
                    type="error">
                    <span v-html="formError"></span>
                </v-alert>
            </v-col>
            <v-col cols=12>
                <v-btn color="primary" small text depressed :to='(lastList) ? lastList : "/datasets"'><v-icon color="primary">mdi-arrow-left</v-icon> {{$tc('Back to')}} {{$tc('Datasets', 2)}} {{$tc('list')}}</v-btn>

                <v-btn text small depressed color="primary" v-if="!editing"  v-scroll-to="{
                    el: '#endOfForm',
                    x: false,
                    y: true
                }">
                    <v-icon>mdi-format-vertical-align-bottom</v-icon>
                    {{$tc('Scroll to Bottom')}}
                </v-btn>

                <v-dialog v-if="!editing" v-model="infoDialog" width="75%">
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" text small color="label_colour" class="">
                            <v-icon>mdi-hexagon-multiple-outline</v-icon>&nbsp;{{$tc("Show Groups")}}
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title class="header">
                            <span>{{$tc('Groups', 2) + ' including ' + dataset.title}}</span>
                            <v-spacer></v-spacer>
                            <v-btn text small depressed class="noHover" @click="infoDialog = false"><v-icon color="text">mdi-close</v-icon></v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-container fluid>
                                <v-row>
                                    <span><h2 class="inline">{{$tc('Groups', 2)}} ({{addingGroups ? availableGroups.length : (dataset.groups ? dataset.groups.length : 0)}})</h2></span>
                                    <v-spacer></v-spacer>
                                    <span v-if="showEdit">
                                        <h4>
                                            <v-btn text depressed color="primary" @click="addingGroups = !addingGroups">
                                                <span v-if="!addingGroups">{{$tc('Add to Group')}}</span>
                                                <span v-else>{{$tc('Stop Adding to Groups')}}</span>
                                            </v-btn>
                                        </h4>
                                    </span>
                                </v-row>

                                <v-row wrap v-if="dataset.groups && dataset.groups.length > 0 && !addingGroups">
                                    <v-col md=6 cols=12 v-for="(group, id) in dataset.groups" :key="'selected-group-'+id">
                                        <v-row align-content="center" align="center" class="borderBottom mr-3">
                                            <v-col cols=10>{{group.title}}</v-col>
                                            <v-col cols=2><v-btn v-if="showEdit" @click="removeGroup(group.id)" text depressed class="noHover"><v-icon>mdi-close</v-icon></v-btn></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row wrap v-else-if="userGroups && userGroups.length > 0 && addingGroups">
                                    <v-col md=6 cols=12 v-for="(group, id) in availableGroups" :key="'available-group-'+id">
                                        <v-row align-content="center" align="center" class="borderBottom mr-3">
                                            <v-col cols=10>{{group.title}}</v-col>
                                            <v-col cols=2><v-btn v-if="showEdit" @click="addGroup(group.id)" text depressed class="noHover"><v-icon>mdi-plus</v-icon></v-btn></v-col>
                                        </v-row>
                                    </v-col>
                                </v-row>
                                <v-row wrap v-else-if="addingGroups">
                                    <v-col cols=12>
                                        <p>There are no groups available to add this dataset to</p>
                                    </v-col>
                                </v-row>
                                <v-row wrap v-else>
                                    <v-col cols=12>
                                        <p>This dataset is not currently in any groups</p>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <v-btn text small depressed color="primary" v-if="!editing" @click="mailLink">
                    <v-icon>mdi-email-outline</v-icon>
                    {{$tc('Contact Data Expert')}}
                </v-btn>

                <v-btn small text depressed v-if="!editing" color="label_colour" class="" v-clipboard="() => permalink" @click="snackbar = true">
                    <v-icon>mdi-share-variant</v-icon>&nbsp;{{$tc("Copy Permalink")}}
                </v-btn>

                <v-btn text small depressed v-if="!createMode && showEdit" @click="toggleEdit" color="label_colour">
                    <v-icon>mdi-pencil-outline</v-icon>&nbsp;{{$tc("Edit Dataset")}}
                </v-btn>

                <v-btn text small depressed v-if="!createMode && showEdit" @click="copyDataset" color="label_colour">
                    <v-icon color="primary">mdi-content-copy</v-icon>
                    {{$tc('Copy') + ' ' + $tc('Datasets',1)}}
                </v-btn>

                <v-btn text small depressed v-if="!createMode && showEdit" :to="{ name: 'resource_create', params: { datasetId: dataset.name }}" color="label_colour">
                    <v-icon color="primary">mdi-plus</v-icon>
                    {{$tc('Add Resource')}}
                </v-btn>

                <DeleteButton
                    v-if="showDatasetDeleteButton"
                    buttonText="Delete Dataset"
                    confirmationMessage="Are you sure you want to delete this record and all its resources?"
                    @delete="deleteDataset">
                </DeleteButton>

                <v-btn v-if="editing" depressed @click="cancel">{{$tc('Cancel')}}</v-btn>

                <v-btn v-if="editing" depressed color="primary" type="submit" @click="submit">{{$tc('Save')}}</v-btn>
            </v-col>
        </v-row>
        <Banner></Banner>
        
        <v-snackbar v-model="snackbar" :timeout=3000 ><span class="mx-auto permalink">{{$tc('Permalink URL Copied to Clipboard')}}</span></v-snackbar>

        <v-row class="mt-12 mb-12" v-if="showFormError || showFormSuccess || dataset.state === 'deleted'"></v-row>

        <v-row class="mt-5 mb-9"></v-row>

        <v-row class="mb-9">
        </v-row>

        <v-row class="workingSpinner" v-if="disabled">
            <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
        </v-row>

        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-row fill-height>
                    <v-col cols=11 md=7 v-if="!!schema">
                        <DynamicForm
                            :schema="schema.dataset_fields"
                            :textFields="textFields"
                            :editing="editing"
                            :values="dataset"
                            :loggedIn="loggedIn"
                            :startingValues="unmodifiedDataset"
                            :disabled="disabled"
                            :selectableUserOrgs="userOrgsArr"
                            :orgName="dynoFormOrgName"
                            ref="dynoForm"
                            :form-defaults="formDefaults"
                            @updated="(field, value) => updateDataset(field, value)"
                        >
                        </DynamicForm>
                        <v-row id="endOfForm" class="mx-0 py-0"></v-row> 
                    </v-col>
                    <v-col cols=1 sm=1></v-col>
                    <v-col cols=4 class="d-none d-sm-block pr-0" v-if="!editing">
                        <v-row class="header-bar mb-0 mr-0" align-content="center">
                            <v-col cols=12>
                                <h4 class="color-text">{{$tc('Resource', 2)}}</h4>
                            </v-col>
                        </v-row>
                        <v-row class="fullWidth mr-0">
                            <v-col cols=12 class="px-0 py-0 my-n2">
                                <ResourceList :createMode="createMode" :showEdit="showEdit" :canDelete="showResourceDeleteButton" :datasetBeingEdited="editing" :resources="dataset.resources"></ResourceList>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-form>
        </ValidationObserver>
        <v-row>
            <v-btn small v-if="notAtTop" depressed color="primary" class="scrollTop pa-4" v-scroll-to="{
                el: '#topOfForm',
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
import Vue from 'vue';
import { mapState, mapGetters } from "vuex";
import { ValidationObserver } from "vee-validate";
import ResourceList from "../dataset/ResourceList";
import Banner from '../banner/Banner'

import {Analytics} from '../../services/analytics';
const analyticsServ = new Analytics()

import {CkanApi} from '../../services/ckanApi';
const ckanServ = new CkanApi();

import DynamicForm from '../form/DynamicForm';
import DeleteButton from '../DeleteButton';

import Permissions from '@/mixins/permissions.vue';

export default {
    mixins: [Permissions],
    components: {
        DynamicForm: DynamicForm,
        ResourceList: ResourceList,
        ValidationObserver: ValidationObserver,
        DeleteButton,
        Banner: Banner
    },
    data() {
        let schemaName = 'bcdc_dataset';
        return {
            editing: this.$route.name === "dataset_create",
            formError: '',
            showFormError: false,
            formSuccess: '',
            showFormSuccess: false,
            schemaName: schemaName,
            disabled: false,
            infoDialog: false,
            addingGroups: false,
            schema: this.$store.state.dataset.schemas[schemaName] ? this.$store.state.dataset.schemas[schemaName] : {},
            createMode: this.$route.name === "dataset_create",
            urlEdited: false,
            expectedNameUpdate: false,
            dynoFormOrgName: '',
            notAtTop: false,
            textFields: [
                'object_name',
                'replacement_record',
                'retention_expiry_date',
                'source_data_path',
                'record_create_date',
                'record_publish_date',
                'record_archive_date',
                'record_last_modified'],
            error: this.datasetError,
            snackbar: false,
            formDefaults: {
                contacts: {
                    displayed: true,
                },
            },
            redrawIndex: 0,
        };
    },
    watch: {
        getAbort(newVal) {
            if(newVal==true) {
                this.$router.push('/datasets');
            }
        },
        dataset(){
            if (this.$route.name === "dataset_create"){
                this.editing = true;
            }
            this.calcDynoFormOrgName()
        },
        $route (to){
            this.redrawIndex++;
            this.editing = (to.name === "dataset_create");
            this.createMode = (to.name === "dataset_create");
        },
    },
    computed: {
        ...mapGetters("organization", {
            orgName: "nameByID",
            ancestorsByName: "ancestorsByName"
        }),
        
        nonSchemaFields: function() {
            let keys = Object.keys(this.dataset);
            let remove = ['id', 'type', 'num_tags', 'num_resources', 'license_title', 'license_url'];
            for (var i=0; i<this.schema.dataset_fields.length; i++){
                remove.push(this.schema.dataset_fields[i].field_name);
                if (typeof(this.schema.dataset_fields[i].subfields) !== "undefined"){
                    for (var j=0; j<this.schema.dataset_fields[i].subfields.length; j++){
                        remove.push(this.schema.dataset_fields[i].subfields[j].field_name);
                    }
                }
            }
            keys = keys.filter(function(el){
                return remove.indexOf(el) < 0;
            });
            keys.sort();
            return keys;
        },

        getAbort() {
            return this.$store.state.dataset.shouldAbort;
        },
        permalink: function(){
            return window.location.origin+'/dataset/'+this.dataset.id
        },

        // schema: function () {
        //     return this.$store.state.dataset.schemas[this.schemaName];
        // },

        datasetId: function datasetId() {
            return this.$route.params.datasetId;
        },
        editLink: function editLink() {
            return "/dataset/" + this.datasetId + "/edit";
        },

        ...mapState({
            dataset: state => {
                if (state.dataset && state.dataset.dataset && state.dataset.dataset.title) {
                    window.document.title = state.dataset.dataset.title + " - Datasets - Data Catalogue";
                }
                return state.dataset.dataset;
            },
            unmodifiedDataset: state => state.dataset.unmodifiedDataset,
            organizations: state => state.organization.orgList,
            shouldAbort: state => state.dataset.shouldAbort,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
            dataLoading: state => state.dataset.dataLoading,
            schemaLoading: state => state.dataset.schemaLoading,
            userLoading: state => state.user.loading,
            schemas: state => state.dataset.schemas,
            userOrgs: state => state.organization.userOrgs,
            datasetError: state => state.dataset.error,
            userGroups: state => state.group.userGroups,
            lastList: state => state.nav.lastDatasetListPage,
            loggedIn: state => state.user.loggedIn,
        }),

        availableGroups: function() {
            let retGroups = [];
            for (let group of this.userGroups) {
                let alreadySelected = false;
                for (let selectedGroup of this.dataset.groups) {
                    if (group.id === selectedGroup.id) {
                        alreadySelected = true;
                    }
                }
                if (!alreadySelected) {
                    retGroups.push(group);
                }
            }
            return retGroups;
        },

        userOrgsArr(){
            let orgArr = [];
            let userOA = Object.values(this.userOrgs);
            for (let i = 0; i<userOA.length; i++){
                let trimLabel = userOA[i].label.trim()
                let id = (this.organizations[trimLabel] && this.organizations[trimLabel].name) ? this.organizations[trimLabel].name : "";
                id = (id === "") ? userOA[i].value : "";
                if (id !== ""){
                    orgArr.push({
                        label: userOA[i].label,
                        value: id
                    });
                }
            }
            return orgArr;
        }
    },

    methods: {

        calcDynoFormOrgName(){
            let name = (this.dataset && this.dataset.organization && this.dataset.organization.name) ? this.dataset.organization.name : '';
            let byId = (this.dataset && this.dataset.owner_org) ? this.orgName(this.dataset.owner_org) : '';
            if ((name === '') && (byId)){
                name = byId;
            }
            this.dynoFormOrgName=name;
        },

        getUserOrgs() {
            if (!this.userOrgs || this.userOrgs.length <= 0){
                this.$store.dispatch("organization/getUserOrgs");
            }
        },
        getDataset() {
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
                this.$store.dispatch("dataset/newDataset");
            }
            if ((!this.createMode) && ((this.dataLoading) && (this.schemaLoading)) || (typeof(this.datasetId) !== "undefined")) {
                this.$store.dispatch("dataset/getDataset", { id: this.datasetId }).then(() => {
                    this.schema = this.$store.state.dataset.schemas[this.schemaName]
                });
            } else {
                this.$store.dispatch('dataset/getDatasetSchema').then(() => {
                    this.$store.commit('dataset/setSchemaLoading', {schemaLoading: false});
                });
                //this.$router.push('/datasets');
            }
        },
        toggleEdit() {
            this.editing = !this.editing;
            this.formError = '';
            this.showFormError = false;
            this.formSuccess = '';
            this.showFormSuccess = false;
        },

        async copyDataset(){
            this.createMode = true;
            this.editing = true;
            let d = JSON.parse(JSON.stringify(this.dataset));
            delete d.title;
            delete d.name;
            delete d.id;
            delete d.publish_state;
            delete d.resources;
            await this.$store.commit("dataset/setCurrentDataset", { dataset: d });
            this.expectedNameUpdate = false;
            this.urlEdited = false;
            this.redrawIndex++;
        },

        clearEdit() {
            this.editing = false;
            this.formError = '';
            this.showFormError = false;
            this.formSuccess = '';
            this.showFormSuccess = false;
        },
        async deleteDataset(){
            const response = await ckanServ.deleteDataset(this.datasetId);

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
            this.formError = "Unknown error deleting dataset";
            this.showFormSuccess = false;
            this.showFormError = true;
        },
        cancel(){
            if (this.createMode){
                this.$router.push('/datasets');
            }

            this.$store.commit("dataset/resetDataset");
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
                result = await this.$store.dispatch("dataset/createDataset")
            }else{
                result = await this.$store.dispatch("dataset/setDataset");
            }
            if (!result || !result.success || result.success === false){
                if (result && result.error && result.error.message){
                    this.formError = result.error.message;
                }else if (result && result.error && result.error.type && result.error.type[0]){
                    this.formError = result.error.type[0];
                }else if (result && result.error){
                    let keys = Object.keys(result.error);
                    let fe = '';
                    for (var i=0; i<keys.length; i++){
                        if (keys[i] === "resources"){ 
                            for (var j=0; j<result.error[keys[i]].length; j++){
                                fe += "Resource " + j +": "
                                let keys2 = Object.keys(result.error[keys[i]][j]);
                                for (let k=0; k<keys2.length; k++){
                                    try{
                                        fe += "  " + keys2[k].substring(0,1).toUpperCase() + keys2[k].substring(1) + " - " + result.error[keys[i]][j][keys2[k]][0];
                                    }catch(e){
                                        fe += "  " + keys2[k].substring(0,1).toUpperCase() + keys2[k].substring(1) + " - " + JSON.stringify(result.error[keys[i]][j][keys2[k]]);
                                    }
                                    fe += "<br />";
                                }
                            }
                        }else if (keys[i] !== '__type'){
                            try{
                                fe += keys[i].substring(0,1).toUpperCase() + keys[i].substring(1) + ": " + result.error[keys[i]][0];
                            }catch(e){
                                fe += keys[i].substring(0,1).toUpperCase() + keys[i].substring(1) + ": " + JSON.stringify(result.error[keys[i]]);
                            }
                            fe += "<br />";
                        }
                        
                    }
                    this.formError = fe;
                }else{
                    this.formError = "Unknown Error";
                }
                this.showFormError = true;
                this.showFormSuccess = false;
            }else{
                this.clearEdit();
                
                this.editing = false;
                this.formSuccess = "Successfully updated";
                await this.$store.commit("dataset/setCurrentDataset", { dataset: this.dataset });
                this.showFormSuccess = true;
                this.showFormError = false;
                if (this.createMode){
                    this.createMode = false;
                    this.$router.push({name: "dataset_view", params: {datasetId: this.dataset.name}}, this.getDataset);
                }
                this.redrawIndex++;
            }
            this.disabled = false;
        },

        async updateDataset(field, newValue){
            if (this.dataset !== {}){
                this.dataset[field] = newValue;

                if (typeof(this.dataset.type) === "undefined"){
                    this.dataset.type = "bcdc_dataset";
                }


                if (field === 'owner_org'){
                    this.calcDynoFormOrgName();
                    if (!this.formDefaults.contacts){
                        this.formDefaults.contacts = {};
                    }
                    Vue.set(this.formDefaults.contacts, 'org', newValue);
                    if (!this.dataset.contacts){
                        this.dataset.contacts = "[]";
                    }
                    let changed = false;
                    let c = JSON.parse(this.dataset.contacts);
                    if (c.length === 0){
                        c[0] = {};
                        c[0].org = false;
                    }

                }else if (field === "name"){
                    if (!this.expectedNameUpdate){
                        this.urlEdited = true;
                    }
                    this.expectedNameUpdate = false;
                }else if (field === 'title'){
                    if ( (!this.urlEdited) && (newValue) ){
                        this.dataset.name = newValue.toLowerCase().replace(/[^A-Za-z0-9_]+/g, '-');
                        this.expectedNameUpdate = true;
                    }

                }else if (field === 'owner_org'){
                    this.formDefaults.contacts = {};
                    Vue.set(this.formDefaults, 'contacts', {org: newValue});
                    if (!this.dataset.contacts){
                        this.dataset.contacts = "[]";
                    }
                    let changed = false;
                    let c = JSON.parse(this.dataset.contacts);
                    if (c.length === 0){
                        c[0] = {};
                        c[0].org = false;
                    }
                    for (let i=0; i<c.length; i++){
                        if (!c[i].org){
                            c[i].org = newValue;
                            changed = true;
                        }
                    }
                    if (changed){
                        let newC = JSON.stringify(c);
                        this.dataset.contacts = newC;
                    }
                }
                
                this.$store.commit('dataset/setCurrentNotUnmodDataset', { dataset: this.dataset } );
            }
        },
        removeGroup(id) {
            for (let i = 0; i < this.dataset.groups.length; i++) {
                if (this.dataset.groups[i].id === id) {
                    this.dataset.groups.splice(i, 1);
                    break;
                }
            }
            this.$store.commit('dataset/setCurrentNotUnmodDataset', { dataset: this.dataset } );
            this.submit();
        },
        addGroup(id) {
            for (let i = 0; i < this.availableGroups.length; i++) {
                if (this.availableGroups[i].id === id) {
                    this.dataset.groups.push(this.availableGroups[i]);
                    break;
                }
            }
            this.$store.commit('dataset/setCurrentNotUnmodDataset', { dataset: this.dataset } );
            this.submit();
        },

        catchScroll() {
            this.notAtTop = false;
            if (window.pageYOffset > 50){
                this.notAtTop = true;
            }
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

            this.$gtag.event('Dataset Mailto', {
                'event_category': 'Link click',
                'event_label': 'Mailto'
            })

            window.open(link, "_blank");
        },

    },

    mounted() {
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getUserOrgs();
        this.$store.dispatch("organization/getOrgs");
        this.$store.dispatch("group/getUserGroups");
        this.getDataset();
        window.addEventListener('scroll', this.catchScroll)
    },
    updated() {
        window.snowplow('refreshLinkClickTracking');
    },
    destroyed() {
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

.rightZero{
    right: 0;
}

.scrollTop{
    position: fixed;
    bottom: 55px; 
    right: 10px;
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
.fixedAlert{
    position: fixed;
    top: 64px;
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
.lower-button {
    font-size: 16px;;
}
.ctrl-button {
    font-size: 16px;
    font-weight: bold;
    height: 50px !important;
}
.preview-button {
    border-style: solid !important;
    border-color: var(--v-primary-base) !important;
    border-width: 2px !important;
    color: var(--v-primary-base) !important;
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
.borderBottom{
    border-bottom: 1px solid var(--v-home_label-base);
}

.workingSpinner{
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -35px;
    margin-top: 35px;
}

.permalink{
    font-size: 16px;
    font-weight: bold;
}

.fauxbar{
    position: fixed;
    top: 65px;
    left: 0px;
    background-color: var(--v-data_background-base);
    z-index: 55;
    right: 0px;
    width: 100%;
    border-bottom: 1px solid;
    border-color: var(--v-label_border-base);
}

</style>
