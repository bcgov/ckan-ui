<template>
    <v-container v-if="error" class="groupContainer px-md-10 py-4">
        <div row align-center justify-center>
            <h1><v-icon x-large>error</v-icon> An Error Occurred: {{error.code}}</h1>
            <p><v-icon x-large>sentiment_very_dissatisfied</v-icon> Please try again or contact your system administrator</p>
        </div>
    </v-container>
    <v-container v-else fluid class="groupContainer px-md-11 py-4">
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
        <v-row wrap class="mr-md-1 pl-6">
            <v-col cols=12 class="">
                <h2 class="primary-text">{{$tc('Groups', 2)}}</h2>
            </v-col>
        </v-row>
        <v-row wrap dense class="d-flex d-sm-none">
            <v-col cols=12 v-if="sysAdmin">
                <v-expansion-panels v-model="manageExpanded" class="noShadow noRadius">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="sideBarHeader">{{$tc('Manage')}}</v-expansion-panel-header>
                        <v-expansion-panel-content dense class="manageSection">
                            <v-dialog
                                v-model="editDialog"
                                width="75%"
                            >
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" class="addGroup primary">{{$tc('Add') + ' ' + $tc('Groups', 1)}}</v-btn>
                                </template>
                                <Edit
                                    :create="true"
                                    v-on:closeEdit='editDialog = false'
                                    v-on:editStatus="editStatus"
                                >
                                </Edit>
                            </v-dialog>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
            <v-col cols=12 class="pt-0 mt-0">
                <v-expansion-panels v-model="aboutExpanded" class="differentShadow noRadius">
                    <v-expansion-panel>
                        <v-expansion-panel-header class="sideBarHeader">{{$tc('Groups', 2)}}</v-expansion-panel-header>
                        <v-expansion-panel-content class="groupAbout">
                            {{$tc('groupAbout')}}
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
        <v-row wrap dense class="mb-0 pb-0 d-none mr-md-1">
            <v-col cols=12 sm=8>
                <v-text-field
                    solo
                    class="searchbox"
                    hide-details
                    v-model="searchText"
                    :label="$tc('Search') + ' ' + $tc('Groups', 2) + ' ' + $tc('found')"
                    v-on:keyup="search"
                    append-icon="search">
                </v-text-field>
            </v-col>
        </v-row>
        <v-row wrap dense class="mt-0 pt-0 d-none mr-md-1">
          <v-col cols=4 class="fadedText">
              {{count}} {{$tc('Groups', count)}}
          </v-col>
        </v-row>
        <v-row wrap class="mb-8 mr-md-1 pl-6">
            <v-col cols=12 sm=7>
                <GroupCard v-for="(group, key) in groups" :key="'group-'+key" :group="group" v-on:groupClicked="navTo(group)" class="pointer"></GroupCard>
            </v-col>
            <v-col sm=1></v-col>
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
                            <v-btn v-on="on" class="addGroup primary" tile block>{{$tc('Add') + ' ' + $tc('Groups', 1)}}</v-btn>
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
                        <h4 class="color-text">{{$tc('Groups', 2)}}</h4>
                    </v-col>
                </v-row>
                <v-row class="fullWidth mr-0">
                    <v-col class="px-0 pt-0 mt-0" cols=12>
                        <v-card tile class="aboutCard">
                            <v-card-text class="groupAbout">
                                {{$tc('groupAbout')}}
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
    import GroupCard from '../groups/GroupCard'

    import { mapState } from "vuex";

    import {Analytics} from '../../services/analytics'
    const analyticsServ = new Analytics()

    import Edit from '../groups/edit'

    import {CkanApi} from '../../services/ckanApi'
    const ckanServ = new CkanApi()

    export default {
        name: "groups",
        components: {
            GroupCard: GroupCard,
            Edit: Edit,
        },

        data() {
            return {
                searchText: (this.st) ? this.st : "",
                count: 0,
                error: null,
                loading: false,
                aboutExpanded: 0,
                manageExpanded: 0,
                editDialog: false,
                formError: "",
                showFormError: false,
                formSuccess: "",
                showFormSuccess: false,
            }
        },
        mounted() {
            analyticsServ.get(window.currentUrl, this.$route.meta.title, window.previousUrl);
            this.$store.dispatch('group/getGroups');
            this.count = this.groups.length;

            let index = 0;

            console.log(groups);

            let groupData = function(data) {
                this.groups[index].datasets = data.result.packages;
                this.groups[index].loading = false;
                index++;

                if (index < this.groups.length) {
                    ckanServ.getGroup(this.groups[index].id).then(data => groupData(data))
                }
            }

            ckanServ.getGroup(this.groups[index].id).then(data => groupData(data))

        },

        watch: {
            groups(newVal){
                this.count = newVal.length;
            }
        },

        computed: {
            ...mapState({
                st: state => state.group.searchText,
                groupList: state => state.group.groups,
                groups: state => state.group.searchedGroups,
                sysAdmin: state => state.user.sysAdmin,
                isAdmin: state => state.user.isAdmin,
                isEditor: state => state.user.isEditor,
                userLoading: state => state.user.userLoading,
            }),
            showCreate: function(){
                // TODO: IF you aren't overriding the admin functionality like BCDC CKAN does then this is what you want
                //return ( ((this.sysAdmin) || (this.userPermissions[this.dataset.organization.name] === "admin") || (this.userPermissions[this.dataset.organization.name] === "editor")));

                return ( (!this.loading) && (!this.userLoading) && ((this.sysAdmin) || (this.isAdmin) || (this.isEditor)) );
            },
        },
        methods:{
            search: function(e){
                if (e.keyCode === 13) {
                    this.findGroups();
                }
            },

            editStatus(status){
                this.formSuccess = status.success;
                this.formError = status.error;
                this.showFormError = status.showError;
                this.showFormSuccess = status.showSuccess;
                if (this.showFormSuccess){
                    this.editDialog = false;
                    this.findGroups();
                }
            },

            findGroups() {
                this.$store.dispatch('group/searchGroups', {searchText: this.searchText});
                this.count = this.groups.length;
            },

            navTo(group){
                this.$router.push({name: "group_view",  params: { groupId: group.name } })
            }
        },
        updated() {
            window.snowplow('refreshLinkClickTracking');
        },
    }
</script>

<style scoped>
    .noShadow{
        box-shadow: none;
    }

    .addGroup{
        height: 50px !important;
        font-weight: bold;
        font-size: 16px;
    }

    .noRadius{
        border-radius: 0 !important;
    }

    .searchbox {
        height: 55px;
        background: var(--v-text_background-base);
        border: 2px solid;
        border-color: var(--v-primary-base);
        border-radius: 2px;
    }

    .groupContainer{
        background: var(--v-data_background-base);
        min-height: 100%;
    }

    .raise {
        margin-bottom: 45px;
    }

    .header{
        background-color: var(--v-primary-base);
        color: var(--v-text-base);
    }

    .manageSection {
        width: 100%;
        background-color: var(--v-menu_secondary-base);
        color: var(--v-text-base);
        height: 40px;
    }

    .sideBarHeader{
        height: 40px;
        line-height: 20px;
        font-size: 16px;
        color: var(--v-text-base);
        background: var(--v-menu_secondary-base);
    }

    .primary-text{
        color: var(--v-label_colour-base);
        font-size: 23px;
        font-weight: bold;
    }

    .fullWidth{
        width: 100%;
    }

    .pointer{
        cursor: pointer;
    }

    .fadedText{
        font-size: 16px;
        font-weight: normal;
        color: var(--v-faded_text-base);
    }

    .fixed{
        position: fixed;
    }

    .rightZero{
        right: 0;
    }

    .aboutCard {
        box-shadow: 0px 5px 5px rgba(0, 0, 0, .2);
    }

    .groupAbout{
        font-size: 16px;
        color: var(--v-faded-text-base);
        background: var(--v-text-background-base);
    }

    .color-text {
        color: var(--v-text-base);
    }

</style>

<style>
    .noShadow .v-expansion-panel:before{
        box-shadow: none;
    }

    .theme--light.v-expansion-panels .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon{
        color: var(--v-text-base) !important;
    }

    .manageSection .v-expansion-panel-content__wrap{
        padding: 0 !important;
        padding-top: 5px !important;
    }
</style>
