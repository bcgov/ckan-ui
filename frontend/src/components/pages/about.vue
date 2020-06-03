<template>
    <v-card tile class="about-card">
        <v-card-title class="header">
            <span>{{$tc('About')}}</span>
            <v-spacer></v-spacer>
            <v-btn text small depressed class="noHover closeButton" @click="close"><v-icon color="text">mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text :class="'px-0 content' + (editing ? ' editing' : '')">
            <v-alert
                :value="formSuccess"
                class="fixed"
                dismissible
                type="success">
                {{formMessage}}
            </v-alert>
            <v-alert
                :value="formError"
                class="fixed"
                dismissible
                type="error">
                {{formMessage}}
            </v-alert>
            <div class="my-4">
                <v-progress-circular
                    indeterminate
                    color="light-blue"
                    v-if="loading"
                ></v-progress-circular>
                <Markdown
                    v-else
                    name="about"
                    :value="about"
                    label=""
                    :editing="editing"
                    :field="{}"
                    scope="about"
                    :disabled="disabled"
                    @edited="(newValue) => { updateValues(newValue) }"
                ></Markdown>
            </div>
        </v-card-text>
        <v-card-actions>
            <span v-if="showEdit" class="wide text-right align-right">
                <v-spacer></v-spacer>
                <v-btn @click="editing = true" depressed class="mr-3 control-button" color="primary">Edit</v-btn>
            </span>
            <span v-else-if="sysAdmin" class="wide text-right align-right">
                <v-spacer></v-spacer>
                <v-btn @click="save" depressed class="mr-3 control-button" color="primary">Save</v-btn>
                <v-btn @click="cancel" depressed class="cancelButton mr-3">Cancel</v-btn>
            </span>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {Analytics} from '../../services/analytics';
    const analyticsServ = new Analytics()

    import Markdown from '../form/components/Markdown';

    import { CkanApi } from '../../services/ckanApi';
    const ckanServ = new CkanApi();

    import { mapState } from 'vuex';

    export default {
        components: {
            Markdown: Markdown
        },

        data() {
            return {
                originalAbout: '',
                about: '',
                editing: false,
                disabled: false,
                loading: true,
                formSuccess: false,
                formError: false,
                formMessage: "Succesfully udpated",
            }
        },
        computed: {
            ...mapState({
                userLoading: state => state.user.loading,
                sysAdmin: state => state.user.sysAdmin,
            }),

            showEdit: function(){
                // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
                //return ( (!this.editing) && ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

                return ( (!this.editing) && (!this.userLoading) && (this.sysAdmin) );

            }
        },
        mounted() {
            this.getAbout();
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
        },
        methods: {
            getAbout(){
                ckanServ.getAbout().then((data) => {
                    this.about = data.result;
                    this.originalAbout = this.about;
                    this.loading = false;
                });
            },
            close(){
                this.$emit('closeDialog');
            },
            updateValues(value){
                this.about = value;
            },
            save(){
                this.disabled = true;
                ckanServ.putAbout(this.about).then( (data) => {
                    if (data.success){
                        this.formSuccess = true;
                        this.formError = false;
                        this.formMessage = "Succesfully udpated";
                        this.editing = false;
                    }else{
                        this.formSuccess = false;
                        this.formError = true;
                        this.formMessage = "Error updating";
                    }
                });
            },
            cancel(){
                this.about = this.originalAbout;
                this.editing = false;
            }
        }
    }

</script>


<style>
    .header{
        background: var(--v-menu_secondary-base);
        color: var(--v-text-base);
        font-size: 16px;
        font-weight: normal;
    }

    .editing{
        background: var(--v-data_background-base);
    }

    .wide{
        width: 100%;
    }

    .closeButton{
        position: absolute !important;
        right: 0px;
    }

    .content p{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .content{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .content ol{
        font-size: 16px;
        color: var(--v-faded_text-base);
    }

    .content * a{
        text-decoration: none;
        font-size: 16px;
        color: var(--v-label_colour-base) !important;
    }

    .v-btn.v-btn--depressed.cancelButton{
        background: var(--v-text_background-base);
        border: 2px solid var(--v-primary-base);
        color: var(--v-primary-base);
        font-weight: normal;
        font-size: 16px;
    }

    .v-btn.v-btn--depressed.control-button{
        font-weight: normal;
        font-size: 16px;
    }

    .about-card {
        background-color: var(--v-data_background-base) !important;
    }
</style>
