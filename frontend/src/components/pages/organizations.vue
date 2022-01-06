<template>
    <v-container v-if="error">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="orgContainer px-md-11 py-4">
        <v-alert
            :value="showFormSuccess"
            class="fixed mr-md-1"
            dismissible
            type="success">
            {{formSuccess}}
        </v-alert>
        <v-alert
            :value="showFormError"
            class="fixed mr-md-1"
            dismissible
            type="error">
            {{formError}}
        </v-alert>
        <v-row wrap class="mr-md-1 pl-6">
            <v-col cols=12 class="">
                <h2 class="title-text">{{$tc('Organizations', 2)}}</h2>
            </v-col>
        </v-row>
        <v-row wrap dense class="d-flex d-sm-none mr-md-1">
            <v-col cols=12 v-if="sysAdmin">
                <v-expansion-panels v-model="manageExpanded" class="noShadow noRadius">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="sideBarHeader">{{$tc('Manage')}}</v-expansion-panel-header>
                        <v-expansion-panel-content dense class="manageSection">
                            <v-btn class="primary manage-button" :to="{name: 'organization_create'}">{{$tc('Add')}} {{$tc('Organizations', 1)}}</v-btn>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols=12>
                <v-expansion-panels v-model="aboutExpanded" class="noShadow noRadius">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="sideBarHeader">{{$tc('Organizations', 2)}}</v-expansion-panel-header>
                        <v-expansion-panel-content class="orgAbout">
                            {{$tc('orgAbout')}}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row wrap dense class="mb-0 pb-0 mr-md-1 pl-6">
            <v-col cols=11 sm=7 class="pr-4">
                <v-text-field
                    solo
                    id="dataset-search"
                    class="searchbox"
                    hide-details
                    v-model="searchT"
                    :label="$tc('Search for organization')"
                    v-on:keyup="search"
                    append-icon="search">
                </v-text-field>
            </v-col>
        </v-row>
        <v-row wrap dense class="mt-0 pt-0 mr-md-1 pl-6">
          <v-col cols=4>
              {{count}} {{$tc('Organizations', count)}}
          </v-col>
        </v-row>
        <v-row wrap class="mb-8 mr-md-1 pl-6 org-list">

            <v-col cols=11 sm=7 v-if="loading">
                <v-progress-circular :size="70" :width="7" color="grey" indeterminate></v-progress-circular>
            </v-col>

            <v-col cols=11 sm=7 v-else>
                <OrgTree v-for="org of orgList" :key="'org-tree-'+orgs[org].id" :top="true" :passedOrg="{ key: org, org: orgs[org] }"></OrgTree>
            </v-col>
            <v-col cols=1 sm=1></v-col>
            <v-col cols=4 class="d-none d-sm-block fixed rightZero pr-1 mr-10">
                <v-row class="manageSection mb-0 mr-0" align-content="center" v-if="sysAdmin">
                    <v-col cols=12>
                        <h4 class="color-text">{{$tc('Manage', 2)}}</h4>
                    </v-col>
                </v-row>
                <v-row class="fullWidth mr-0" v-if="sysAdmin">
                    <v-col cols=12 class="px-0">
                        <v-dialog
                            v-model="editDialog"
                            width="75%"
                        >
                            <template v-slot:activator="{ on }">
                                <v-btn class="primary manage-button" tile block v-on="on">{{$tc('Add')}} {{$tc('Organizations', 1)}}</v-btn>
                            </template>
                            <Edit
                                :create="true"
                                v-on:closeEdit='editDialog = false'
                                v-on:editStatus="editStatus"
                            >
                            </Edit>
                        </v-dialog>
                    </v-col>
                </v-row>
                <v-row class="fullWidth mr-0"></v-row>
                <v-row class="manageSection mb-0 mr-0" align-content="center" v-if="sysAdmin">
                    <v-col cols=12>
                        <h4 class="color-text">{{$tc('Organizations', 2)}}</h4>
                    </v-col>
                </v-row>
                <v-row class="fullWidth mr-0 pt-0">
                    <v-col class="px-0 pt-0" cols=12>
                        <v-card tile>
                            <v-card-text class="orgAbout">
                                {{$tc('orgAbout')}}
                            </v-card-text>
                        </v-card>
                    </v-col>
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

    import Vue from 'vue';

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
                loading: state => state.organization.loading,
            }),

            orgList: function(){
                var r = Object.keys(this.orgs);
                return r.sort();
            }
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

                    Vue.set(this, 'orgs', result);
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
        },
        updated() {
            window.snowplow('refreshLinkClickTracking');
        },
    }

</script>

<style scoped>
    .orgContainer{
        background: var(--v-data_background-base);
    }

    .searchbox {
        height: 55px;
        background: var(--v-text_background-base);
        border: 2px solid;
        border-color: var(--v-primary-base);
        border-radius: 2px;
    }

    .raise {
        margin-bottom: 45px;
    }

    .header{
        background-color: var(--v-primary-base);
    }

    .color-text {
        color: var(--v-text-base);
    }

    .sideBarHeader{
        font-weight: bold;
        font-size: 16px;
        color: var(--v-text-base);
        background: var(--v-menu_secondary-base);
        border-radius: 0;
        min-height: 40px;
        height: 40px;
        line-height: 20px;
    }

    .noShadow{
        box-shadow: none;
    }

    .noRadius{
        border-radius: 0;
    }

    .title-text{
        color: var(--v-label_colour-base);
        font-size: 23px;;
    }

    .manageSection {
        width: 100%;
        background-color: var(--v-menu_secondary-base);
        color: var(--v-text-base);
        height: 40px;
    }

    .manage-button {
        font-weight: bold;
        font-size: 16px;
        height: 50px !important;
    }

    .fixed{
        position: fixed;
    }

    .rightZero{
        right: 0;
    }

    .orgAbout{
        font-size: 16px;
        color: var(--v-faded_text-base);
        box-shadow: 0 5px 5px rgba(0, 0, 0, .2);
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

    .searchbox i.theme--light.v-icon{
        color: var(--v-icon-primary);
    }
</style>

<style>
.org-list .v-expansion-panel-header {
    position:  relative;
    height: auto;
    line-height: 1.5em;
    padding-left: 40px !important;
}

.org-list .v-expansion-panel-header i.v-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    -ms-transform: translateY(-50%);
}

.noShadow .v-expansion-panel:before{
    box-shadow: none;
}
</style>
