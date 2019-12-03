<template>
  <v-card class="dialog">
      <v-toolbar color="primary">
          <v-btn class="no-right-margin" icon @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
          <v-progress-circular
                v-if="loading || (!this.create && (typeof(resourceStore[resource.id])==='undefined' || typeof(resourceStore[resource.id].metadata) === 'undefined'))"
                indeterminate
                color="light-blue"
            ></v-progress-circular>

            <div v-else>
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
                <ValidationObserver ref="observer" v-slot="{ validate }" slim>
                    <v-form ref="form">
                        <DynamicForm
                            :schema="schema.resource_fields"
                            :textFields="textFields"
                            :editing="edit || create"
                            :values="!create ? resourceStore[resource.id].metadata : newResource"
                            :scope="scope"
                            :disabled="disabled"
                            @updated="(field, value) => updateResource(field, value)"
                        >
                        </DynamicForm>
                    </v-form>
                </ValidationObserver>
            </div>
      </v-card-text>
      <v-card-actions v-if="edit || create ">
            <v-btn
                xs2
                color="error"
                class="text-xs-center"
                @click="$emit('closePreviewDialog')"
            >
                Cancel
            </v-btn>
            <v-btn
                xs2
                color="primary"
                class="text-xs-center"
                @click="save"
            >
                Save
            </v-btn>
      </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex";
import DynamicForm from '../form/DynamicForm';
import { ValidationObserver } from "vee-validate";
import {CkanApi} from '../../services/ckanApi';
const ckanServ = new CkanApi();

export default{
    components:{
        DynamicForm: DynamicForm,
        ValidationObserver: ValidationObserver
    },
    props: {
        edit: Boolean,
        resource: Object,
        resourceIndex: Number,
        create: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        let SCHEMA_NAME = "bcdc_dataset"
        return {
            name: this.resource.name ? this.resource.name : "Create a new resource",
            loading: false,
            textFields: ['name', 'object_name', 'object_short_name', 'object_table_comments'],
            doNotSend: ['last_modified', "isUrl", "cache_url", "cache_last_updated", "size", "upload"],
            newResource: {},
            formSuccess: '',
            formError: '',
            showFormError: false,
            disabled: false,
            showFormSuccess: false,
            schemaName: SCHEMA_NAME,
            schema: this.$store.state.dataset.schemas[SCHEMA_NAME] ? this.$store.state.dataset.schemas[SCHEMA_NAME] : {},
            scope: this.create ? 'createResourceForm' : 'resourceForm-'+this.resourceIndex,
        }
    },
    computed: {
        ...mapState({
            dataset: state => state.dataset.dataset,
            authUser: state => state.user.authUser,
            resourceStore: state => state.dataset.resources,
            schemaLoading: state => state.dataset.schemaLoading,
            schemas: state => state.dataset.schemas,
        })
    },

    methods: {
        updateResource(field, newValue){
            if (this.create){
                this.newResource[field] = newValue;
                // eslint-disable-next-line
            }else{
                this.resource[field] = newValue;
                //this.$store.commit('dataset/setCurrentDataset', { dataset: this.dataset } );
            }
        },
        save: async function(){
            this.disabled = true;
            const valid = await this.$refs.observer.validate();
            if (!valid){
                this.formError = "Please fix validation errors"
                this.showFormError = true;
                this.formSuccess = '';
                this.showFormSuccess = false;
                this.disabled = false;
                return;
            }

            let data = new FormData();
            
            data.set('package_id', this.dataset.id);
            var keys = Object.keys(this.resource);
            if (this.create){
                keys = Object.keys(this.newResource);
            }


            let isUrl = true;
            for (var i=0; i<keys.length; i++){

                if (keys[i] === "isUrl"){
                    if (this.create){
                        isUrl = this.newResource[keys[i]];
                    }else{
                        isUrl = this.resource[keys[i]];
                    }
                }

                if ( (keys[i] === "url") && (!isUrl) ){
                    if (this.create){
                        data.set("upload", this.newResource[keys[i]]);
                    }else{
                        data.set("upload", this.resource[keys[i]]);
                    }
                    keys[i] = "upload"; 
                }

                if (this.doNotSend.indexOf(keys[i]) === -1){
                    let value = null;
                    
                    if (this.create){
                        value = this.newResource[keys[i]];
                    }else{
                        value = this.resource[keys[i]];
                    }

                    if ( (keys[i] === "json_table_schema") && ((typeof(value) === 'undefined') || (value === '')) ){
                        //data.set(keys[i], JSON.stringify({}));
                    }else{
                        data.set(keys[i], value);
                    }
                    
                }
            }

            var self = this;
            
            function handleUploadResponse(){
                if (self.create){
                    self.formSuccess = 'Succesfully created resource';
                }else{
                    self.formSuccess = 'Succesfully updated resource';
                }
                self.formError = '';
                self.showFormError = false;
                self.showFormSuccess = true;
                self.$emit('closePreviewDialog');
                self.disabled = false;
                if (!self.create){
                    self.$store.commit('dataset/setResource', {id: self.id, resource: null});
                }
                if (self.create){
                    location.reload();
                }

            }

            function handleErrorResponse(error){
                self.formSuccess = '';

                let keys = Object.keys(error.response.data.error);
                let e = "";
                for (var i=0; i<keys.length; i++){
                    if (keys[i].toLowerCase().indexOf('type') === -1){
                        e = keys[i] + " - " + error.response.data.error[keys[i]];
                    }
                }

                e = ( (e == "") && (error.response.data.error.type) ) ? error.response.data.error.type : e;
                e = ( (e == "") && (error.response.data.error.__type) ) ? error.response.data.error.__type : e;
                
                self.formError = e;
                self.showFormError = true;
                self.showFormSuccess = false;
                self.disabled = false;

            }

            await this.$store.dispatch('user/getCurrentUser');

            if (this.create){
                ckanServ.createResource(data, this.authUser.jwt).then(handleUploadResponse).catch(handleErrorResponse);
            }else{
                ckanServ.updateResource(data, this.authUser.jwt).then(handleUploadResponse).catch(handleErrorResponse);
            }
        }
    }

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