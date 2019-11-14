<template>
    <v-container v-if="dataLoading || schemaLoading" fluid>
        <v-row row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-row>
    </v-container>
    <v-container v-else-if="datasetError" fluid>
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else grid-list-md class="main-area">
        <v-alert
            :value="dataset.state === 'deleted'"
            type="warning">
            You are viewing a deleted dataset
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
        <v-row wrap>
            <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        </v-row>

        <v-row wrap v-if="!createMode">
            <v-col cols=12>
                <label>{{$tc("Permalink")}}:</label>
                <span>{{permalink}}</span>
                <v-btn fab small v-clipboard="() => permalink">
                    <v-icon>file_copy</v-icon>
                </v-btn>
                
            </v-col>
        </v-row>
        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-row v-if="showEdit" class="button-container">
                    <v-btn
                        v-if="canDeleteResources"
                        fab
                        color="error"
                        class="text-xs-center"
                        @click="deleteDataset"
                    >
                        <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn
                        v-if="showEdit"
                        fab
                        color="info"
                        class="text-xs-center"
                        right
                        @click="toggleEdit"
                    >
                        <v-icon>edit</v-icon>
                    </v-btn>
                </v-row>
                <v-row v-else-if="editing" class="button-container">
                    <v-btn
                        xs2
                        color="error"
                        class="text-xs-center"
                        @click="cancel"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        xs2
                        color="primary"
                        class="text-xs-center"
                        type="submit"
                        @click="submit(errors)"
                    >
                        Save
                    </v-btn>
                </v-row>

                <v-row fill-height>
                    <v-col cols=12 md=8 v-if="!!schema">
                        <DynamicForm
                            :schema="schema.dataset_fields"
                            :textFields="textFields"
                            :editing="editing"
                            :values="dataset"
                            :disabled="disabled"
                            :selectableUserOrgs="userOrgs"
                            ref="dynoForm"
                            @updated="(field, value) => updateDataset(field, value)"
                        >
                        </DynamicForm>
                    </v-col>
                    <v-col cols=12 md=4>
                        <ResourceList :createMode="createMode" :showEdit="showEdit" :canDelete="canDeleteResources" :datasetBeingEdited="editing" :resources="dataset.resources"></ResourceList>
                        
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

import Breadcrumb from "../breadcrumb/Breadcrumb";
import {Analytics} from '../../services/analytics';
const analyticsServ = new Analytics()

import {CkanApi} from '../../services/ckanApi';
const ckanServ = new CkanApi();

import DynamicForm from '../form/DynamicForm';

export default {
    components: {
        DynamicForm: DynamicForm,
        Breadcrumb: Breadcrumb,
        ResourceList: ResourceList,
        ValidationObserver: ValidationObserver,
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
            schema: this.$store.state.dataset.schemas[schemaName] ? this.$store.state.dataset.schemas[schemaName] : {},
            createMode: this.$route.name === "dataset_create",
            textFields: [
                'object_name',
                'replacement_record',
                'retention_expiry_date',
                'source_data_path',
                'iso_topic_string',
                'record_create_date',
                'record_publish_date',
                'record_archive_date',
                'record_last_modified']
        };
    },
    watch: {
        getAbort(newVal) {
            if(newVal==true) {
                this.$router.push('/datasets');
            }
        },
    },
    computed: {
        breadcrumbs: function(){
            return [
                { icon: "home", label: "Home", route: "/" },
                { label: "Datasets", route: "/datasets" },
                { label: this.dataset.title ? this.dataset.title : "Fetching Dataset...", translate: this.dataset.title ? false : true }
            ]
        },

        nonSchemaFields: function(){
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
            dataset: state => state.dataset.dataset,
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
        ...mapGetters("organization", {
            getSubOrgs: "getSubOrgs"
        }),

        canDeleteResources: function(){
            if (!this.dataset.organization){
                return false;
            }
            return ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor"))
        },

        showEdit: function(){
            // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
            //return ( (!this.editing) && ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));
            if (!this.dataset.organization){
                return ( (!this.dataLoading) && (!this.schemaLoading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin)) );
            }
            return ( (!this.dataLoading) && (!this.schemaLoading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.userPermissions[this.dataset.organization.name] === "editor")));
        }
    },

    methods: {
        getUserOrgs() {
            if (this.userOrgs.length <= 0){
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
            )
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
        async deleteDataset(){
            const response = await ckanServ.deleteDataset(this.datasetId);

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
                this.toggleEdit();
                if (this.createMode){
                    this.$router.push('/dataset/'+this.dataset.name)
                }
                this.formSuccess = "Successfully updated";
                this.showFormSuccess = true;
                this.showFormError = false;
            }
            this.disabled = false;
        },
        updateDataset(field, newValue){
            if (typeof(this.dataset.type) === "undefined"){
                this.dataset.type = "bcdc_dataset";
            }
            this.dataset[field] = newValue;
            this.$store.commit('dataset/setCurrentNotUnmod', { dataset: this.dataset } );
        },
    },

    mounted (){
        if (this.createMode){
            this.$store.commit('dataset/clearDataset');
        }
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.getUserOrgs();
        this.$store.dispatch("organization/getOrgs");
        this.getDataset();
        //this.$refs.form.validate();
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
</style>
