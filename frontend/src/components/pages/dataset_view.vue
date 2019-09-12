<template>
    <v-container v-if="loading" fluid>
        <v-layout row align-center justify-center>
            <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
        </v-layout>
    </v-container>
    <v-container v-else grid-list-md class="main-area">
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
        <v-layout row wrap>
            <Breadcrumb :breadcrumbs="breadcrumbs"></Breadcrumb>
        </v-layout>

        <v-layout row wrap v-if="!createMode">
            <v-flex xs12>
                <label>{{$tc("Permalink")}}:</label>
                <span>{{permalink}}</span>
                <v-btn fab small v-clipboard="() => permalink">
                    <v-icon>file_copy</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
        <ValidationObserver ref="observer" v-slot="{ validate }" slim>
            <v-form ref="form" @submit.prevent="nothing">
                <v-btn
                    v-if="showEdit"
                    fab
                    dark
                    fixed
                    bottom
                    right
                    color="info"
                    class="text-xs-center"
                    @click="toggleEdit"
                >
                    <v-icon>edit</v-icon>
                </v-btn>
                <v-layout v-else-if="editing" row class="button-container">
                    <v-btn
                        dark
                        xs2
                        color="error"
                        class="text-xs-center"
                        @click="cancel"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        dark
                        xs2
                        color="primary"
                        class="text-xs-center"
                        type="submit"
                        @click="submit(errors)"
                    >
                        Save
                    </v-btn>
                </v-layout>
                <template v-if="typeof(schema) === 'undefined'">
                    <OldView></OldView>
                </template>
                <template v-else>
                    <v-layout row wrap fill-height>
                        <v-flex xs12 md8>
                            <DynamicForm
                                :schema="schema.dataset_fields"
                                :textFields="textFields"
                                :editing="editing"
                                :values="dataset"
                                ref="dynoForm"
                                @updated="(field, value) => updateDataset(field, value)"
                            >
                            </DynamicForm>
                        </v-flex>
                        <v-flex xs12 md4>
                            <ResourceList :createMode="createMode" :showEdit="showEdit" :resources="dataset.resources"></ResourceList>
                        </v-flex>
                    </v-layout>
                </template>
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
import oldView from './dataset_old_view';


import DynamicForm from '../form/DynamicForm';

export default {
    components: {
        DynamicForm: DynamicForm,
        Breadcrumb: Breadcrumb,
        ResourceList: ResourceList,
        OldView: oldView,
        ValidationObserver: ValidationObserver,
    },
    data() {
        return {
            editing: this.$route.name === "dataset_create",
            formError: '',
            showFormError: false,
            formSuccess: '',
            showFormSuccess: false,
            schemaName: 'bcdc_dataset',
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
                'record_last_modified'],
        };
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

        permalink: function(){
            return window.location.origin+'/dataset/'+this.dataset.id
        },

        
        datasetId: function datasetId() {
            return this.$route.params.datasetId;
        },
        editLink: function editLink() {
            return "/dataset/" + this.datasetId + "/edit";
        },

        schema: function(){
            return this.$store.state.dataset.schemas[this.schemaName];
        },

        ...mapState({
            dataset: state => state.dataset.dataset,
            userPermissions: state => state.user.userPermissions,
            sysAdmin: state => state.user.sysAdmin,
            isAdmin: state => state.user.isAdmin,
            loading: state => state.dataset.loading,
            userLoading: state => state.dataset.loading,
        }),
        ...mapGetters("organization", {
            getSubOrgs: "getSubOrgs",
        }),

        showEdit: function(){
            // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
            //return ( (!this.editing) && ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));
            if (!this.dataset.organization){
                return ( (!this.loading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin)) );
            }
            return ( (!this.loading) && (!this.editing) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.userPermissions[this.dataset.organization.name] === "editor")));
        }
    },

    methods: {
        getDataset() {
            this.$store.dispatch("dataset/getDataset", { id: this.datasetId });
        },
        toggleEdit() {
            this.editing = !this.editing;
            this.formError = '';
            this.showFormError = false;
            this.formSuccess = '';
            this.showFormSuccess = false;
        },
        cancel(){
            //this.$store.commit("dataset/resetDataset");
            //this.toggleEdit();
        },
        
        nothing(){
        },

        async submit(){
            const isValid = await this.$refs.observer.validate();

            if (!isValid){
                this.formError = "Please fix the fields in error before submitting";
                this.showFormError = true;
                this.showFormSuccess = false;
                return;
            }

            let result = {};
            if (this.createMode){
                result = await this.$store.dispatch("dataset/createDataset")
            }else{
                result = await this.$store.dispatch("dataset/setDataset");
            }
            if (result.success === false){
                if (result.error.message){
                    this.formError = result.error.message;
                }else if (result.error.type && result.error.type[0]){
                    this.formError = result.error.type[0];
                }else{
                    this.formError = "Unknown Error";
                }
                this.showFormError = true;
                this.showFormSuccess = false;
            }else{
                this.toggleEdit();
                this.formSuccess = "Successfully updated";
                this.showFormSuccess = true;
                this.showFormError = false;
            }
        },
        updateDataset(field, newValue){
            this.dataset[field] = newValue;
            this.$store.commit('dataset/setCurrentDataset', { dataset: this.dataset } );
        },
    },

    mounted(){
        analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        this.$store.dispatch("organization/getOrgs");
        this.getDataset();
        //this.$refs.form.validate();
    }
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
    z-index: 99999;
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
</style>
