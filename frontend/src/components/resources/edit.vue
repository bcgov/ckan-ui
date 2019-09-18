<template>
  <v-card class="dialog">
      <v-toolbar dark color="primary">
          <v-btn icon dark @click="$emit('closePreviewDialog')">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>{{name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
            <i v-if="loading || typeof(resourceStore[resource.id])==='undefined' || typeof(resourceStore[resource.id].metadata) === 'undefined'" class="fa fa-circle-o-notch fa-spin"></i>

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
                            :editing="edit"
                            :values="resourceStore[resource.id].metadata"
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
                dark
                xs2
                color="error"
                class="text-xs-center"
                @click="$emit('closePreviewDialog')"
            >
                Cancel
            </v-btn>
            <v-btn
                dark
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
        return {
            name: this.resource.name ? this.resource.name : "Create a new resource",
            loading: false,
            textFields: ['name', 'object_name'],
            newResource: {},
            formSuccess: '',
            formError: '',
            showFormError: false,
            showFormSuccess: false,
            schemaName: 'bcdc_dataset',
            scope: this.create ? 'createResourceForm' : 'resourceForm-'+this.resourceIndex,
        }
    },
    computed: {
        schema: function(){
            return this.$store.state.dataset.schemas[this.schemaName];
        },
        ...mapState({
            dataset: state => state.dataset.dataset,
            authUser: state => state.user.authUser,
            resourceStore: state => state.dataset.resources,
        }),

    },
    mounted() {
        if (this.create){
            let keys = Object.keys(this.schema);
            for (var i=0; i<keys.length; i++){
                this.newResource[keys[i]] = null;
            }
        }else{
            this.$store.dispatch('dataset/getResource', {datasetResourceIndex: this.resourceIndex, id: this.resource.id});
        }
        
    },

    methods: {
        updateResource(field, newValue){
            if (this.create){
                this.newResource[field] = newValue;
            }else{
                this.resource[field] = newValue;
                this.$store.commit('dataset/setCurrentDataset', { dataset: this.dataset } );
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
                if (this.create){
                    data.set(keys[i], this.newResource[keys[i]]);
                }else{
                    data.set(keys[i], this.resource[keys[i]]);
                }
            }

            var self = this;
            
            function handleUploadResponse(rData){
                //eslint-disable-next-line
                console.log(rData);
                self.formSuccess = 'Succesfully updated resource';
                self.formError = '';
                self.showFormError = false;
                self.showFormSuccess = true;

            }

            function handleErrorResponse(error){
                //eslint-disable-next-line
                console.log(error);
                self.formSuccess = '';
                self.formError = error.response.data.error.type[0];
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
</style>