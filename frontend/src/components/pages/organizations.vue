<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occured: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid>
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
        <v-row wrap>
            <v-col cols=12 class="">
                <h2 class="primary-text">{{$tc('Organizations', 2)}}</h2>
            </v-col>
        </v-row>
        <v-row wrap dense class="d-flex d-sm-none">
             <v-col cols=12 v-if="sysAdmin">
                <v-expansion-panels v-model="manageExpanded">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="header">{{$tc('Manage')}}</v-expansion-panel-header>
                        <v-expansion-panel-content dense class="manageSection">
                            <v-btn class="primary" :to="{name: 'organization_create'}">{{$tc('Add')}} {{$tc('Organizations', 1)}}</v-btn>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols=12>
                <v-expansion-panels v-model="aboutExpanded">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="header">{{$tc('Organizations', 2)}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            {{$tc('orgAbout')}}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row wrap dense class="mb-0 pb-0">
            <v-col cols=12 sm=8>
                <v-text-field solo v-model="searchT" append-icon="search" :label="$tc('Search') + ' ' + $tc('Organizations', 2)" v-on:keyup="search"></v-text-field>
            </v-col>
        </v-row>
        <v-row wrap dense class="mt-0 pt-0">
          <v-col cols=4>
              {{count}} {{$tc('Organizations', count)}}
          </v-col>
      </v-row>
        <v-row wrap align-center justify-center class="mb-8">
            <v-col cols=12 sm=8>
                <OrgTree :top="true" v-for="(org, key) in orgs" :key="'org-tree-'+key" :org="{key: key, org: org}"></OrgTree>
            </v-col>
            <v-col cols=4 class="d-none d-sm-block">
                <v-row class="manageSection mb-0" v-if="sysAdmin">
                    <v-card elevation=0>
                        <v-card-title class='header mb-2'>{{$tc('Manage', 2)}}</v-card-title>
                    </v-card>
                </v-row>
                <v-row class="manageSection mb-5" v-if="sysAdmin">
                    <v-dialog
                        v-model="editDialog"
                        width="75%"
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn class="primary fullWidth" v-on="on">{{$tc('Add')}} {{$tc('Organizations', 1)}}</v-btn>
                        </template>
                        <Edit
                            :create="true"
                            v-on:closeEdit='editDialog = false'
                            v-on:editStatus="editStatus"
                        >
                        </Edit>
                    </v-dialog>
                </v-row>
                <v-row>
                    <v-card elevation=0>
                        <v-card-title class='header mb-2'>{{$tc('Organizations', 2)}}</v-card-title>
                        <v-card-text>
                            {{$tc('orgAbout')}}
                        </v-card-text>
                    </v-card>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
        </v-row>
    </v-container>
</template>

<script>
    import OrgTree from '../organizations/OrgTree'
    import Edit from '../organizations/edit';

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics();

    import { mapState } from 'vuex';

    export default {
        components: {
            OrgTree: OrgTree,
            Edit: Edit,
        },

        data() {
            return {
                count: 0,
                error: null,
                orgs: {},
                aboutExpanded: 0,
                searchT: this.searchText ? this.searchText : "",
                manageExpanded: 0,
                editDialog: false,
                formSuccess: "",
                formError: "",
                showFormError: false,
                showFormSuccess: false,
            }
        },

        watch: {
            searchText(newVal){
                this.searchT = newVal;
            },

            organizations(){
                this.findOrgs();
            }
        },

        computed: {
            ...mapState({
                organizations: state => state.organization.orgList,
                sysAdmin: state => state.user.sysAdmin,
                searchText: state => state.organization.searchText,
            })
        },

        methods: {
            editStatus(status){
                this.formSuccess = status.success;
                this.formError = status.error;
                this.showFormError = status.showError;
                this.showFormSuccess = status.showSuccess;
                if (this.showFormSuccess){
                    this.editDialog = false;
                }
            },
            search: function(e){
                if (e.keyCode === 13) {
                    this.$store.commit('organization/setSearchText', {searchText: e.target.value});
                    this.findOrgs();
                }
            },

            findOrgs(){
                if (this.searchText === '') {
                    this.orgs = this.organizations
                    this.count = Object.keys(this.organizations).length;
                    
                } else {
                    let result = {};
                    let okeys = Object.keys(this.organizations);
                    for (let i=0; i<okeys.length; i++){
                        if (okeys[i].toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0){
                            result[okeys[i]] = this.organizations[okeys[i]];
                        }else if ( (this.organizations[okeys[i]].children) && (this.checkChildren(this.searchText, this.organizations[okeys[i]].children)) ){
                            result[okeys[i]] = this.organizations[okeys[i]];
                        }
                    }

                    this.orgs = result;
                    this.count = Object.keys(this.orgs).length;
                }


            },

            checkChildren(search, org){
                let okeys = Object.keys(org);
                for (let i=0; i<okeys.length; i++){
                    if (org[okeys[i]].title.toLowerCase().indexOf(search.toLowerCase()) >= 0){
                        return true;
                    }else if ( (org[okeys[i]].children) && (this.checkChildren(search, org[okeys[i]].children)) ){
                        return true;
                    }
                }
                return false;
            }
        },

        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.searchT = this.searchText;
            this.$store.dispatch('organization/getSchema');
            this.$store.dispatch('organization/getOrgs');
        }
    }

</script>

<style scoped>
    .raise {
        margin-bottom: 45px;
    }

    .header{
        background-color: var(--v-primary-base);
        color: var(--v-text-base);
    }
    
    .primary-text{
        color: var(--v-primary-base)
    }

    .manageSection .v-card, .manageSection .v-card__title, .manageSection a.primary{
        width: 100%;
    }

</style>

<style>
    .theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon{
        color: var(--v-text-base) !important;
    }

    .manageSection .v-expansion-panel-content__wrap{
        padding: 0 !important;
        padding-top: 5px !important;
    }

    .fullWidth{
        width: 100%;
    }
</style>