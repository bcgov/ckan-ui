<template>
  <v-card class="dialog">
      <v-toolbar color="primary">
          <v-btn icon @click="$emit('closePreviewDialog')">
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
            doNotSend: ['last_modified', "isUrl", "cache_url", "cache_last_updated", "size"],
            newResource: {},
            formSuccess: '',
            formError: '',
            showFormError: false,
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
    mounted() {
        let self = this;
        this.$store.dispatch('dataset/getResource', {datasetResourceIndex: this.resourceIndex, id: this.id});
        let unsub = this.$store.subscribe(
            (mutation, state) => {
                if(mutation.type == "dataset/setSchema") {
                    self.schema = state.dataset.schemas[self.schemaName];
                    unsub();
                }
            }
        )
        
    },

    watch: {
        resourceStore(val) {
            // eslint-disable-next-line
            console.log("Resource changed:")
            // eslint-disable-next-line
            console.log(val)
        }
    },

    methods: {
        updateResource(field, newValue){
            if (this.create){
                this.newResource[field] = newValue;
            }else{
                this.resource[field] = newValue;
                //this.$store.commit('dataset/setCurrentDataset', { dataset: this.dataset } );
            }
        },
        save: async function(){
            const valid = await this.$refs.observer.validate();
            if (!valid){
                this.formError = "Please fix validation errors"
                this.showFormError = true;
                this.formSuccess = '';
                this.showFormSuccess = false;
                return;
            }

            let data = new FormData();
            
            data.set('package_id', this.dataset.id);
            var keys = Object.keys(this.resource);
            if (this.create){
                keys = Object.keys(this.newResource);
            }

            for (var i=0; i<keys.length; i++){
                if (this.doNotSend.indexOf(keys[i]) === -1){
                    if (this.create){
                        data.set(keys[i], this.newResource[keys[i]]);
                    }else{
                        data.set(keys[i], this.resource[keys[i]]);
                    }
                }
            }

            var self = this;
            
            function handleUploadResponse(rData){
                //eslint-disable-next-line
                console.log(rData);
                if (self.create){
                    self.formSuccess = 'Succesfully created resource';
                }else{
                    self.formSuccess = 'Succesfully updated resource';
                }
                self.formError = '';
                self.showFormError = false;
                self.showFormSuccess = true;
                self.$emit('closePreviewDialog');
                if (!self.create){
                    self.$store.commit('dataset/setResource', {id: self.id, resource: null});
                }
                if (self.create){
                    location.reload();
                }

            }

            function handleErrorResponse(error){
                //eslint-disable-next-line
                console.log(error);
                self.formSuccess = '';
                let e = error.response.data.error.type ? error.response.data.error.type[0] : error.response.data.error._type;
                e = e ? e : error.response.data.error.__type[0];
                self.formError = e;
                self.showFormError = true;
                self.showFormSuccess = false;

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
</style>