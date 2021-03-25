<template>
    <v-card>
        <v-card-title class="header">
            <span>{{createMode ? $tc('Add') : $tc('Edit')}} {{$tc('Groups', 1)}}</span>
            <v-spacer></v-spacer>
            <v-btn text small depressed class="noHover" @click="close"><v-icon color="text">mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
            <v-container fluid v-if="loading">
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="grey"
                    indeterminate
                ></v-progress-circular>
                <div>
                    {{schema.groups}}
                </div>
            </v-container>

            <v-container fluid v-else>
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

                <v-row class="workingSpinner" v-if="disabled">
                    <v-progress-circular :size="70" :width="7" color="primary" indeterminate></v-progress-circular>
                </v-row>

                <ValidationObserver ref="observer" v-slot="{ validate }" slim>
                    <v-form ref="form" @submit.prevent="nothing">
                        <DynamicForm
                            :schema="schema.group.fields"
                            :textFields="textFields"
                            :editing="true"
                            :values="group"
                            :disabled="disabled"
                            ref="dynoForm"
                            area="/group/"
                            @updated="(field, value) => updateGroup(field, value)"
                        >
                        </DynamicForm>
                    </v-form>
                </ValidationObserver>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="submit" color="primary">Save</v-btn>
            <v-btn @click="close">Cancel</v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import { mapState } from 'vuex';
import { ValidationObserver } from 'vee-validate'
import DynamicForm from '../form/DynamicForm'


export default {
    components: {
        DynamicForm: DynamicForm,
        ValidationObserver: ValidationObserver,
    },

    props: {
        create: Boolean,
    },

    data() {
        return {
            showFormSuccess: false,
            showFormError: false,
            formError: "",
            formSuccess: "",
            disabled: false,
            textFields: [],
            loading: true,
            error: false,
            createMode: this.create

        }
    },

    computed: {
        ...mapState({
            group: state => state.group.group,
            schema: state => state.group.groupSchemas
        }),
    },

    mounted(){
        let self = this;
        let unsub = this.$store.subscribe(
            (mutation) => {
                if(mutation.type == "group/setSchema") {
                    unsub();
                    self.loading = false;
                }
            }
        )
        this.$store.dispatch('group/getGroupSchemas');
    }, 

    methods: {
        close(){
            this.$emit('closeEdit');
        },

        updateGroup(field, value){
            this.group[field] = value;
            this.$store.commit('group/setCurrentNotUnmod', { group: this.group } );
        },

        async submit(){
                this.disabled = true;
                const isValid = await this.$refs.observer.validate();

                if (!isValid){
                    this.formError = "Please fix the fields in error before submitting";
                    this.showFormError = true;
                    this.showFormSuccess = false;
                    this.disabled = false;
                    let status = {
                        error: this.formError,
                        showError: true,
                        showSuccess: false,
                        success: ""
                    }
                    this.$emit('editStatus', status);
                    return;
                }

                let result = {};
                try{
                    if (this.createMode){
                        result = await this.$store.dispatch("group/createGroup")
                    }else{
                        result = await this.$store.dispatch("group/setGroup");
                    }
                }catch(e){
                    this.formError = e;
                    this.showFormError = true;
                    this.showFormSuccess = false;
                    this.disabled = false;
                    let status = {
                        error: this.formError,
                        showError: true,
                        showSuccess: false,
                        success: ""
                    }
                    this.$emit('editStatus', status);
                    return;
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
                    this.formSuccess = this.createMode ? "Successfully created" : "Successfully updated";
                    this.showFormSuccess = true;
                    this.showFormError = false;
                }
                let status = {
                    error: this.formError,
                    showError: this.showFormError,
                    showSuccess: this.showFormSuccess,
                    success: this.formSuccess
                }
                this.$emit('editStatus', status);
                this.disabled = false;
            },
    }

}
</script>

<style scoped>
.header{
    background: var(--v-primary-base);
    color: var(--v-text-base);
}
.noHover:hover{
    box-shadow: none;
    border: none;
    background: none;
}

.noHover:hover:before{
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