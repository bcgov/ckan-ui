<template>
    <v-card>
        <v-card-title class="header">
            <span>{{createMode ? $tc('Add') : $tc('Edit')}} {{$tc('Organizations', 1)}}</span>
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
                            :schema="schema.organization.fields"
                            :textFields="textFields"
                            :editing="true"
                            :values="group"
                            :loggedIn="loggedIn"
                            :disabled="disabled"
                            ref="dynoForm"
                            area="/organization/"
                            :selectableUserOrgs="userOrgsArr"
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
            textFields: ["short_name", "url"],
            loading: false,
            error: false,
            createMode: this.create,
            expectedNameUpdate: false,
            urlEdited: false,
        }
    },

    computed: {
        ...mapState({
            organizations: state => state.organization.orgList,
            group: state => state.organization.organization,
            schema: state => state.organization.schemas,
            userOrgs: state => state.organization.userOrgs,
            loggedIn: state => state.user.loggedIn,
        }),
        userOrgsArr(){
            let orgArr = [];
            let userOA = Object.values(this.userOrgs);
            for (let i = 0; i<userOA.length; i++){
                let trimLabel = userOA[i].label.trim()
                let id = (this.organizations[trimLabel] && this.organizations[trimLabel].name) ? this.organizations[trimLabel].name : "";
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

    mounted(){
        if (this.createMode){
            this.$store.dispatch('organization/newOrg');
        }
        this.$store.dispatch('organization/getOrgs');
        this.$store.dispatch('organization/getUserOrgs');
    },

    methods: {
        close(){
            this.$emit('closeEdit');
        },

        updateGroup(field, value){
            if (field === "groups"){
                this.group.groups = [{name: value}];
            }else if (field === "upload"){//dynamic form forced label "Image url" to return as upload
                this.group.image_url = value;
            }else{
                if (this.create){
                    if (field === "name"){
                        if (!this.expectedNameUpdate){
                            this.urlEdited = true;
                        }
                        this.expectedNameUpdate = false;
                    }else if (field === 'title'){
                        if ( (!this.urlEdited) && (value) ){
                            this.group.name = value.toLowerCase().replace(/[^A-Za-z0-9_]+/g, '-');
                            this.expectedNameUpdate = true;
                        }

                    }
                }
                this.group[field] = value;
            }
            this.$store.commit('organization/setCurrentNotUnmod', { group: this.group } );
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
                        result = await this.$store.dispatch("organization/createOrg")
                    }else{
                        result = await this.$store.dispatch("organization/setOrg");
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
                    this.$store.dispatch('organization/getOrgsNoCache');
                    if (!this.createMode){
                        this.$store.dispatch('organization/getOrg', {id: this.group.id})
                    }
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